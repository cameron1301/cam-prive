#!/usr/bin/env python3
"""CAM Yacht Escape share card + X banner from the approved exterior photograph."""
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

SRC = "/workspace/public/yacht/approved/01_HERO_EXTERIOR_APPROVED.png"
FONT_DIR = "/workspace/.grok/fonts"

NAVY = (14, 39, 68)          # #0e2744
GOLD = (224, 177, 90)        # #e0b15a
FOAM = (245, 248, 250)       # white foam
MIST = (198, 210, 218)       # quiet location

SERIF_I = f"{FONT_DIR}/Cormorant-SemiBoldItalic.ttf"
CINZEL = f"{FONT_DIR}/Cinzel-Medium.ttf"
SANS = f"{FONT_DIR}/Outfit-Medium.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def kill_overlay(im):
    """Replace the baked-in left overlay with nearby water/sky so it cannot be read."""
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w, _ = arr.shape
    y0, y1 = 42, 272
    x_solid = 575
    x_fade = 700
    plate = arr.copy()
    col = arr[y0:y1, 1:7].mean(axis=1)
    # low-amplitude vertical variation already in the column; stretch it across
    plate[y0:y1, 0:x_fade] = col[:, None, :]
    plate_img = Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8))
    plate_img = plate_img.filter(ImageFilter.GaussianBlur(radius=5))
    plate = np.asarray(plate_img).astype(np.float32)

    yy = np.arange(h)[:, None].astype(np.float32)
    xx = np.arange(w)[None, :].astype(np.float32)
    tx = np.clip((xx - x_solid) / float(x_fade - x_solid), 0, 1)
    tx = tx * tx * (3 - 2 * tx)
    ax = 1 - tx
    ax = np.where(xx < x_solid, 1.0, ax)
    top = np.clip((yy - y0) / 18.0, 0, 1)
    bot = np.clip((y1 - yy) / 18.0, 0, 1)
    ay = np.minimum(top, bot)
    ay = ay * ay * (3 - 2 * ay)
    a = (ax * ay).astype(np.float32)
    out = arr * (1 - a)[:, :, None] + plate * a[:, :, None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), mode="RGB")


def grade(im):
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    return im.filter(ImageFilter.UnsharpMask(radius=1.15, percent=55, threshold=3))


def navy_fade(photo, opaque_end, fade_end):
    arr = np.asarray(photo).astype(np.float32)
    h, w, _ = arr.shape
    xs = np.arange(w, dtype=np.float32)[None, :]
    t = np.clip((xs - opaque_end) / float(fade_end - opaque_end), 0, 1)
    t = t * t * (3 - 2 * t)
    a = np.where(xs < opaque_end, 1.0, 1 - t).astype(np.float32)
    navy = np.array(NAVY, dtype=np.float32)
    comp = arr * (1 - a)[:, :, None] + navy * a[:, :, None]
    return Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8), mode="RGB")


def draw_tracked(draw, x, baseline, text, fnt, fill, tracking):
    for ch in text:
        draw.text((x, baseline), ch, font=fnt, fill=fill, anchor="ls")
        x += fnt.getlength(ch) + tracking
    return x


def ink_bbox(layer):
    alpha = np.asarray(layer.split()[-1])
    ys, xs = np.where(alpha > 8)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def render_og():
    src = kill_overlay(Image.open(SRC))
    scale = 630 / src.height
    resized = src.resize((round(src.width * scale), 630), Image.Resampling.LANCZOS)
    resized = grade(resized)
    # Keep the stern and the yacht; the left water carried the overlay.
    left = resized.width - 1200
    photo = resized.crop((left, 0, resized.width, 630))
    card = navy_fade(photo, opaque_end=448, fade_end=710)

    W, H = card.size
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    brand_f = font(CINZEL, 17)
    head_f = font(SERIF_I, 72)
    loc_f = font(SANS, 15)

    # Measure lockup height with a dry run, then center it vertically.
    brand = "CAM YACHT ESCAPE"
    line1 = "Your Weekend"
    line2 = "on the Bay"
    loc = "SIERRA POINT HARBOR"
    brand_track = 2.6
    loc_track = 2.15

    def brand_width():
        return sum(brand_f.getlength(c) + brand_track for c in brand) - brand_track

    # Build at a provisional top, then shift.
    x0 = 58
    # provisional baselines
    # brand cap-height sits just above its baseline; use font size as a guide
    b_brand = 0
    # We'll draw into a tall scratch and read ink, then paste shifted.
    scratch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scratch)
    y = 80
    # brand baseline: y + ascent-ish. Use anchor ls so y is baseline.
    # Cinzel caps: baseline = top + size * 0.78
    base_brand = y + 16
    draw_tracked(sd, x0, base_brand, brand, brand_f, GOLD, brand_track)
    rule_y = base_brand + 14
    sd.rectangle([x0, rule_y, x0 + 54, rule_y + 2], fill=GOLD)
    base1 = rule_y + 78
    sd.text((x0, base1), line1, font=head_f, fill=FOAM, anchor="ls")
    base2 = base1 + 68
    sd.text((x0, base2), line2, font=head_f, fill=FOAM, anchor="ls")
    base_loc = base2 + 36
    draw_tracked(sd, x0, base_loc, loc, loc_f, MIST, loc_track)

    box = ink_bbox(scratch)
    if box is None:
        raise SystemExit("og lockup produced no ink")
    ink_h = box[3] - box[1]
    target_top = (H - ink_h) // 2
    shift = target_top - box[1]
    layer.alpha_composite(scratch.transform(scratch.size, Image.Transform.AFFINE, (1, 0, 0, 0, 1, -shift)))

    # Affine above moves content DOWN when shift is positive? 
    # PIL affine maps output->input. (1,0,0, 0,1,-shift) means
    # input_y = output_y - shift, so content moves down by shift. Yes if shift>0
    # and target_top > box[1]. Our scratch starts near y=80, ink is upper, 
    # target is centered, shift positive, content moves down. Good.

    out = card.convert("RGBA")
    out.alpha_composite(layer)
    flat = out.convert("RGB")

    # verify ink on the flattened card against edges — remeasure the shifted layer
    shifted_box_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shifted_box_layer.alpha_composite(scratch.transform(scratch.size, Image.Transform.AFFINE, (1, 0, 0, 0, 1, -shift)))
    final_box = ink_bbox(shifted_box_layer)
    print("OG ink bbox", final_box, "size", flat.size, "brand_w", round(brand_width()))
    x0i, y0i, x1i, y1i = final_box
    if x0i < 28 or y0i < 28 or x1i > W - 28 or y1i > H - 28:
        print("WARNING og ink near edge")
    if x1i > 520:
        print("WARNING og headline may leave the solid navy", x1i)
    flat.save("/workspace/.grok/preview/og-preview.png", quality=95)
    return flat


def render_banner():
    src = kill_overlay(Image.open(SRC))
    scale = 1200 / src.width
    resized = src.resize((1200, round(src.height * scale)), Image.Resampling.LANCZOS)
    resized = grade(resized)
    # Vertical window through bimini, hull, and registration.
    top = 68
    photo = resized.crop((0, top, 1200, top + 264))
    card = navy_fade(photo, opaque_end=600, fade_end=900)

    W, H = card.size
    scratch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scratch)

    brand_f = font(CINZEL, 13)
    head_f = font(SERIF_I, 42)
    loc_f = font(SANS, 13)
    x0 = 44
    brand_track = 2.15
    loc_track = 1.7

    base_brand = 36
    draw_tracked(sd, x0, base_brand, "CAM YACHT ESCAPE", brand_f, GOLD, brand_track)
    rule_y = base_brand + 10
    sd.rectangle([x0, rule_y, x0 + 40, rule_y + 2], fill=GOLD)
    base_head = rule_y + 46
    sd.text((x0, base_head), "Your Weekend on the Bay", font=head_f, fill=FOAM, anchor="ls")
    base_loc = base_head + 26
    draw_tracked(sd, x0, base_loc, "SIERRA POINT HARBOR", loc_f, MIST, loc_track)

    box = ink_bbox(scratch)
    print("BANNER ink bbox", box, "midline", H / 2, "bottom fifth", H * 0.8, "right half", W / 2)
    x0i, y0i, x1i, y1i = box
    # Hard rejects from the banner contract.
    if x1i >= W / 2:
        print("WARNING banner ink in right half", x1i)
    if y1i >= H * 0.8:
        print("WARNING banner ink in bottom fifth", y1i)
    if y0i < 16:
        print("WARNING banner ink edge-hugs top", y0i)
    if y1i > H / 2:
        print("NOTE banner ink extends below midline", y1i)

    out = card.convert("RGBA")
    out.alpha_composite(scratch)
    flat = out.convert("RGB")
    flat.save("/workspace/.grok/preview/banner-preview.png", quality=95)
    return flat


if __name__ == "__main__":
    render_og()
    render_banner()
    print("previews written")
