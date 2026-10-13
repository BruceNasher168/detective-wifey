#!/usr/bin/env python3
"""
validate_app_design.py
Deterministic validation script to audit virtual app components against their canonical
app-design.md specifications and the AppDefinition contract.
"""

import sys
import os
import re
import argparse
from pathlib import Path

def parse_app_design(design_file_path: Path):
    """Extracts color tokens and brand parameters from app-design.md."""
    if not design_file_path.exists():
        return None
    content = design_file_path.read_text(encoding='utf-8')
    
    # Extract hex colors
    hex_colors = re.findall(r'#([0-9a-fA-F]{6})', content)
    
    # Check for touch target guidelines
    has_touch_target_rule = '44' in content
    
    return {
        'hex_colors': set(f'#{c.upper()}' for c in hex_colors),
        'has_touch_target_rule': has_touch_target_rule,
    }

def validate_component(component_file_path: Path, design_spec: dict):
    """Audits the React component implementation against design and contract requirements."""
    if not component_file_path.exists():
        return False, [f"Component file not found: {component_file_path}"]
    
    content = component_file_path.read_text(encoding='utf-8')
    errors = []
    warnings = []
    
    # 1. Contract verification
    if 'onReturnHome' not in content:
        errors.append("Missing 'onReturnHome' handler (user cannot return to OS home screen).")
    if 'onTagSuspect' not in content:
        errors.append("Missing 'onTagSuspect' hook (user cannot tag evidence into Wife's Notebook).")
    if 'AppDefinition' not in content and 'appDefinition' not in content:
        warnings.append("Component does not export or reference 'AppDefinition'.")
        
    # 2. Touch target compliance (>= 44x44px)
    touch_pattern = re.compile(r'(min-[wh]-\[44px\]|h-11|h-12|h-14|min-height:\s*44px|min-width:\s*44px|44px)', re.IGNORECASE)
    if not touch_pattern.search(content):
        warnings.append("No explicit >= 44px minimum touch target classes detected on interactive elements.")
        
    # 3. Brand color alignment
    if design_spec and design_spec['hex_colors']:
        found_colors = [c for c in design_spec['hex_colors'] if c.lower() in content.lower()]
        if not found_colors:
            warnings.append(f"None of the documented brand hex colors from app-design.md were detected in component styling.")

    return len(errors) == 0, errors, warnings

def main():
    parser = argparse.ArgumentParser(description="Validate virtual app against app-design.md and contracts.")
    parser.add_argument("--app-id", required=True, help="Target app ID (e.g., loza, vietpay, grap)")
    parser.add_argument("--component", required=True, help="Path to component file (e.g., src/apps/loza/LozaApp.tsx)")
    parser.add_argument("--workspace-root", default=".", help="Root directory of the workspace")

    args = parser.parse_args()
    root = Path(args.workspace_root)
    
    # Locate app-design.md
    design_path = root / ".agent-artifacts" / "project-knowledge-base" / "solution-context" / "apps" / args.app_id / "app-design.md"
    if not design_path.exists():
        # Check nested phone-os paths
        alt_path = root / ".agent-artifacts" / "project-knowledge-base" / "solution-context" / "apps" / "phone-os" / args.app_id / "app-design.md"
        if alt_path.exists():
            design_path = alt_path

    if not design_path.exists():
        print(f"[ERROR] Could not find authoritative app-design.md for appId: '{args.app_id}'")
        sys.exit(1)

    design_spec = parse_app_design(design_path)
    component_path = Path(args.component)
    
    valid, errors, warnings = validate_component(component_path, design_spec)
    
    print(f"\n--- App Design & Contract Audit: {args.app_id} ---")
    print(f"Authoritative Design SSOT: {design_path}")
    print(f"Target Component:          {component_path}\n")

    if errors:
        print("[FAIL] Contract Errors:")
        for err in errors:
            print(f"  - {err}")
    else:
        print("[PASS] Contract Invariants Satisfied.")

    if warnings:
        print("\n[WARN] Design & Accessibility Warnings:")
        for warn in warnings:
            print(f"  - {warn}")

    if not errors and not warnings:
        print("[PERFECT] Component 100% compliant with app-design.md and AppDefinition contract.")

    sys.exit(0 if valid else 1)

if __name__ == "__main__":
    main()

