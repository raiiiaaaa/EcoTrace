"""
EcoTrace - Capacitor Resource Generator
Generates icon.png (1024x1024) and splash.png (2732x2732) from icon_apk.png
"""

from PIL import Image, ImageDraw, ImageFont
import os

SOURCE_ICON = "icon_apk.png"
OUTPUT_DIR = "resources"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 50)
print("EcoTrace - Capacitor Resource Generator")
print("=" * 50)

src = Image.open(SOURCE_ICON).convert("RGBA")

# ── 1. ICON.PNG (1024x1024, white background) ──
print("\n[1/3] Generating icon.png (1024x1024)...")
icon = Image.new("RGB", (1024, 1024), (255, 255, 255))
src_resized = src.resize((1024, 1024), Image.LANCZOS)
r, g, b, a = src_resized.split()
icon.paste(src_resized, (0, 0), mask=a)
icon.save(os.path.join(OUTPUT_DIR, "icon.png"), "PNG", optimize=True)
print(f"   [OK] Saved: {OUTPUT_DIR}/icon.png")

# ── 2. SPLASH.PNG (2732x2732, dark green bg, centered logo) ──
print("\n[2/3] Generating splash.png (2732x2732)...")

BG_COLOR = (27, 46, 27)
LOGO_SIZE = 800
CANVAS = 2732

splash = Image.new("RGB", (CANVAS, CANVAS), BG_COLOR)

logo = src.resize((LOGO_SIZE, LOGO_SIZE), Image.LANCZOS)
logo_r, logo_g, logo_b, logo_a = logo.split()

logo_x = (CANVAS - LOGO_SIZE) // 2
logo_y = (CANVAS - LOGO_SIZE) // 2 - 80

logo_rgb = Image.merge("RGB", (logo_r, logo_g, logo_b))
splash.paste(logo_rgb, (logo_x, logo_y), mask=logo_a)

# Add "EcoTrace" text
font = None
font_paths = [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/calibri.ttf",
]
for fp in font_paths:
    if os.path.exists(fp):
        font = ImageFont.truetype(fp, size=160)
        break

draw = ImageDraw.Draw(splash)
text = "EcoTrace"
text_y = logo_y + LOGO_SIZE + 40

if font:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((CANVAS - text_w) // 2, text_y), text, fill=(255, 255, 255), font=font)
else:
    draw.text((CANVAS // 2 - 200, text_y), text, fill=(255, 255, 255))

splash.save(os.path.join(OUTPUT_DIR, "splash.png"), "PNG", optimize=True)
print(f"   [OK] Saved: {OUTPUT_DIR}/splash.png")

# ── 3. ICON-FOREGROUND.PNG (432x432 adaptive icon) ──
print("\n[3/3] Generating adaptive icon assets...")
fg = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
logo_fg = src.resize((360, 360), Image.LANCZOS)
fg.paste(logo_fg, (36, 36), logo_fg)
fg.save(os.path.join(OUTPUT_DIR, "icon-foreground.png"), "PNG")
print(f"   [OK] Saved: {OUTPUT_DIR}/icon-foreground.png")

bg_img = Image.new("RGB", (432, 432), (255, 255, 255))
bg_img.save(os.path.join(OUTPUT_DIR, "icon-background.png"), "PNG")
print(f"   [OK] Saved: {OUTPUT_DIR}/icon-background.png")

print("\n" + "=" * 50)
print("[SUCCESS] ALL RESOURCES GENERATED!")
print(f"   Location: ./{OUTPUT_DIR}/")
print("=" * 50)
print("\nFiles created:")
for f in sorted(os.listdir(OUTPUT_DIR)):
    fp = os.path.join(OUTPUT_DIR, f)
    size_kb = os.path.getsize(fp) // 1024
    print(f"  - {f} ({size_kb} KB)")
print("\nNext step: npx capacitor-assets generate --android --ios")
