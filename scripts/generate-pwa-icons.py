from PIL import Image, ImageDraw
from pathlib import Path
out = Path('public/icons')
out.mkdir(exist_ok=True)
for name, size, inset in [('icon-192.png',192,0),('icon-512.png',512,0),('maskable-512.png',512,1),('apple-touch-icon.png',180,0)]:
    im = Image.new('RGB', (1024,1024), '#0f172a')
    d = ImageDraw.Draw(im)
    # Existing magnifying-glass identity; central artwork fits maskable safe zone.
    d.ellipse((280,250,660,630), outline='#e11d48', width=64)
    d.line((610,580,755,735), fill='#e11d48', width=72)
    d.ellipse((718,698,790,770), fill='#e11d48')
    im.resize((size,size),Image.Resampling.LANCZOS).save(out/name)
