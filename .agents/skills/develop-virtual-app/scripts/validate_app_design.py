#!/usr/bin/env python3
"""
validate_app_design.py
Deterministic validation script to audit virtual app components against their canonical
app-design.md specifications, the AppDefinition contract, and universal workspace invariants.
"""

import sys
import os
import re
import argparse
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Common emoji ranges in Unicode
EMOJI_PATTERN = re.compile(
    r'[\U0001F600-\U0001F64F]'  # emoticons
    r'|[\U0001F300-\U0001F5FF]'  # symbols & pictographs
    r'|[\U0001F680-\U0001F6FF]'  # transport & map symbols
    r'|[\U0001F1E0-\U0001F1FF]'  # flags
    r'|[\U00002702-\U000027B0]'  # dingbats
    r'|[\U0001F900-\U0001F9FF]'  # supplemental symbols
    r'|[\U0001FA00-\U0001FA6F]'  # chess/symbols
    r'|[\U0001FA70-\U0001FAFF]'  # symbols and pictographs extended
)

# Banned icon packages (strictly Ionicons / react-icons/io5 is the SSOT)
BANNED_ICON_PACKAGES = [
    'lucide-react',
    '@heroicons',
    'react-feather',
    'phosphor-react',
    '@tabler/icons',
]

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
        return False, [f"Component file not found: {component_file_path}"], []
    
    content = component_file_path.read_text(encoding='utf-8')
    # If the component delegates views to a child components/ directory, aggregate them
    combined_content = content
    sub_components_dir = component_file_path.parent / "components"
    if sub_components_dir.exists() and sub_components_dir.is_dir():
        for sub_file in sub_components_dir.glob("*.tsx"):
            combined_content += "\n" + sub_file.read_text(encoding='utf-8')

    errors = []
    warnings = []
    
    # 1. Contract verification
    if 'onReturnHome' not in content:
        errors.append("Missing 'onReturnHome' handler (user cannot return to OS home screen).")
    if 'onTagSuspect' not in content:
        errors.append("Missing 'onTagSuspect' hook (user cannot tag evidence into Wife's Notebook).")
    if 'AppDefinition' not in content and 'appDefinition' not in content:
        warnings.append("Component does not export or reference 'AppDefinition'.")
        
    # 2. Universal Swipe-Right Back Navigation Invariant
    if 'useSwipeBack' not in combined_content and 'SwipeBackContainer' not in combined_content:
        warnings.append("Missing 'useSwipeBack' or 'SwipeBackContainer' (violates universal swipe-right back navigation).")

    # 3. Touch target compliance (>= 44x44px)
    touch_pattern = re.compile(r'(min-[wh]-\[44px\]|h-11|h-12|h-14|min-height:\s*44px|min-width:\s*44px|44px)', re.IGNORECASE)
    if not touch_pattern.search(combined_content):
        warnings.append("No explicit >= 44px minimum touch target classes detected on interactive elements.")

    # 4. Universal Forensic Long-Press & Pinning Invariant (Zero Physical Pin Buttons)
    # Prohibit physical buttons containing "Ghim"
    pin_button_match = re.search(r'<button[^>]*>[^<]*(Ghim|ghim)[^<]*</button>', combined_content, re.IGNORECASE)
    if pin_button_match:
        errors.append(
            f"Forbidden physical pin button detected: '{pin_button_match.group(0)}'. "
            "Evidence must ONLY be pinned via StoryEvidenceTarget and UniversalEvidenceModal upon 380ms long-press."
        )

    # Require StoryEvidenceTarget / UniversalEvidenceModal when onTagSuspect is used
    if 'onTagSuspect' in combined_content and 'StoryEvidenceTarget' not in combined_content and 'UniversalEvidenceModal' not in combined_content:
        errors.append(
            "Component tags suspects but does not use 'StoryEvidenceTarget' or 'UniversalEvidenceModal'. "
            "Evidence must be gathered via the universal long-press modal on narrative items."
        )

    # 5. Strict Zero-Emoji Invariant
    emoji_matches = EMOJI_PATTERN.findall(combined_content)
    if emoji_matches:
        formatted_emojis = [f"U+{ord(e):04X}" for e in sorted(set(emoji_matches))]
        errors.append(
            f"Forbidden raw Unicode emojis detected: {formatted_emojis}. "
            "All UI iconography must use canonical Ionicons ('react-icons/io5') or responsive vector SVGs."
        )

    # 6. Canonical Icon Pack Invariant (Zero Banned Libraries)
    for pkg in BANNED_ICON_PACKAGES:
        if f"from '{pkg}'" in combined_content or f'from "{pkg}"' in combined_content:
            errors.append(
                f"Forbidden icon package '{pkg}' detected. "
                "The canonical icon pack is strictly 'react-icons/io5' (Ionicons)."
            )

    # 7. Brand color alignment
    if design_spec and design_spec['hex_colors']:
        found_colors = [c for c in design_spec['hex_colors'] if c.lower() in combined_content.lower()]
        if not found_colors:
            warnings.append(f"None of the documented brand hex colors from app-design.md were detected in component styling.")

    # 8. Universal Shared Typography Invariant (design.md §3.1.1)
    # Prohibit arbitrary pixel font sizes (e.g. text-[10px], text-[11px])
    arbitrary_font_pattern = re.compile(r'\btext-\[\d+px\]')
    arbitrary_fonts = arbitrary_font_pattern.findall(combined_content)
    if arbitrary_fonts:
        errors.append(
            f"Forbidden arbitrary pixel font classes detected: {sorted(set(arbitrary_fonts))}. "
            "All virtual apps must inherit the shared 13-tier Apple HIG dynamic typography tokens (text-ios-*). "
            "See design.md §3.1.1."
        )

    return len(errors) == 0, errors, warnings

def main():
    parser = argparse.ArgumentParser(description="Validate virtual app against app-design.md and contracts.")
    parser.add_argument("--app-id", required=True, help="Target app ID (e.g., zola, vietpay, grap)")
    parser.add_argument("--component", required=True, help="Path to component file (e.g., src/apps/zola/ZolaApp.tsx)")
    parser.add_argument("--workspace-root", default=".", help="Root directory of the workspace")

    args = parser.parse_args()
    root = Path(args.workspace_root)
    
    # App ID alias mapping
    app_id_aliases = {
        'comms': ['comms', 'phone', 'messages'],
        'zola': ['zola', 'internet-messaging'],
        'vietpay': ['vietpay', 'banking'],
        'poshee': ['poshee', 'ecommerce'],
        'husband_notes': ['husband_notes', 'personal-notes'],
        'netsurf': ['netsurf', 'web-browser'],
        'grap': ['grap', 'ride-hailing'],
        'photos': ['photos'],
    }
    target_ids = app_id_aliases.get(args.app_id, [args.app_id])

    # Search all app-design.md files under apps directory by frontmatter app_id or dir name
    apps_root = root / ".agent-artifacts" / "project-knowledge-base" / "solution-context" / "apps"
    design_path = None
    if apps_root.exists():
        for candidate in apps_root.rglob("app-design.md"):
            try:
                text = candidate.read_text(encoding="utf-8")
                match = re.search(r"app_id:\s*([^\r\n]+)", text)
                if match and match.group(1).strip() in target_ids:
                    design_path = candidate
                    break
                # Also check parent directory name
                if candidate.parent.name in target_ids:
                    design_path = candidate
                    break
            except Exception:
                pass

    if not design_path or not design_path.exists():
        print(f"[ERROR] Could not find authoritative app-design.md for appId: '{args.app_id}'")
        sys.exit(1)

    design_spec = parse_app_design(design_path)
    component_path = Path(args.component)
    
    valid, errors, warnings = validate_component(component_path, design_spec)
    
    print(f"\n--- App Design & Contract Audit: {args.app_id} ---")
    print(f"Authoritative Design SSOT: {design_path}")
    print(f"Target Component:          {component_path}\n")

    if errors:
        print("[FAIL] Contract & Invariant Violations:")
        for err in errors:
            print(f"  - {err}")
    else:
        print("[PASS] Contract Invariants Satisfied.")

    if warnings:
        print("\n[WARN] Design & Accessibility Warnings:")
        for warn in warnings:
            print(f"  - {warn}")

    if not errors and not warnings:
        print("[PERFECT] Component 100% compliant with app-design.md, AppDefinition, and workspace invariants.")

    sys.exit(0 if valid else 1)

if __name__ == "__main__":
    main()
