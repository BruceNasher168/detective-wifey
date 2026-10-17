"""Render canonical SVG install icons. Requires Pillow and Chrome/Edge."""
from pathlib import Path
from PIL import Image
import os
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET

OUT = Path(__file__).resolve().parents[1] / 'public/icons'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

def find_browser():
    candidates = [os.environ.get('CHROME_BIN'), shutil.which('chromium'), shutil.which('google-chrome')]
    for base in ('PROGRAMFILES', 'PROGRAMFILES(X86)', 'LOCALAPPDATA'):
        for app in ('Google/Chrome/Application/chrome.exe', 'Microsoft/Edge/Application/msedge.exe'):
            candidates.append(str(Path(os.environ.get(base, '')) / app))
    return next(p for p in candidates if p and Path(p).is_file())

def render(browser, directory, maskable=False):
    root = ET.parse(OUT / 'app-icon.svg').getroot()
    root.set('width', '1024')
    root.set('height', '1024')
    # OS applies the corner mask. Keep PNG backgrounds full bleed.
    for child in root:
        if child.tag == f'{{{NS}}}rect':
            child.set('rx', '0')
    if maskable:
        # Fit artwork inside the central 80%-diameter safe circle.
        group = ET.Element(f'{{{NS}}}g', {'transform': 'translate(256 256) scale(.75) translate(-256 -256)'})
        for child in list(root):
            if child.tag not in {f'{{{NS}}}{tag}' for tag in ('title', 'desc', 'defs', 'rect')}:
                root.remove(child)
                group.append(child)
        root.append(group)
    html = directory / ('maskable.html' if maskable else 'icon.html')
    screenshot = html.with_suffix('.png')
    html.write_text('<!doctype html><style>html,body{margin:0;background:#0f172a}svg{display:block}</style>' + ET.tostring(root, encoding='unicode'), encoding='utf-8')
    subprocess.run([browser, '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
                    '--no-default-browser-check', f'--user-data-dir={directory / "profile"}',
                    '--force-device-scale-factor=1', '--window-size=1024,1280',
                    f'--screenshot={screenshot}', html.as_uri()],
                   check=True, capture_output=True, timeout=60)
    with Image.open(screenshot) as image:
        return image.crop((0, 0, 1024, 1024)).convert('RGB')

if __name__ == '__main__':
    with tempfile.TemporaryDirectory(prefix='detective-icons-', dir=OUT) as temp:
        directory = Path(temp)
        browser = find_browser()
        regular = render(browser, directory)
        maskable = render(browser, directory, True)
        for name, size, image in [
            ('icon-192.png', 192, regular), ('icon-512.png', 512, regular),
            ('apple-touch-icon.png', 180, regular), ('maskable-512.png', 512, maskable),
        ]:
            image.resize((size, size), Image.Resampling.LANCZOS).save(OUT / name)
            print(f'Generated {name} ({size}x{size})')
