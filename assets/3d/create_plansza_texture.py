from PIL import Image

# Load original logo
im = Image.open(r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d\logo_extracted.png")
bbox = (18, 750, 1982, 1850)
logo_crop = im.crop(bbox)

# Flipped horizontally
logo_flipped = logo_crop.transpose(Image.FLIP_LEFT_RIGHT)

tex_w, tex_h = 2048, 2048
# Dark black satin metal background (#141414)
bg = Image.new("RGBA", (tex_w, tex_h), (20, 20, 20, 255))

target_logo_w = 900
# Scaled up vertically by another +20% (from 465 to 560)
target_logo_h = 560

logo_resized = logo_flipped.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)

# Paste centered
pos_x = (tex_w - target_logo_w) // 2
pos_y = (tex_h - target_logo_h) // 2

bg.paste(logo_resized, (pos_x, pos_y), logo_resized)

out_path = r"d:\PRACA\ARTBAR\ARTBAR NEW WEB\assets\3d\plansza_composite.png"
bg.save(out_path, "PNG")
print(f"Saved texture with +20% vertical height to {out_path} (size: {target_logo_w}x{target_logo_h})")
