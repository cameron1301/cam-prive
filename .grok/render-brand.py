#!/usr/bin/env python3
"""CAM Privé share card and X banner from the approved hero photograph."""
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
import numpy as np

HERO = "/workspace/public/yacht/hero-frame.jpg"
MARK = "/workspace/public/brand/cam-prive-light.png"
FONT = "/workspace/.grok/fonts"

NAVY = (7, 20, 29)          # #07141D
IVORY = (247, 244, 238)     # #F7F4EE
WHITE = (255, 255, 255)     # #FFFFFF
CHAMPAGNE = (182, 162, 122) # #B6A27A

TAGLINE = "EXCLUSIVE EXPERIENCES BY CAM"
EXPERIENCE = "THE BAY ESCAPE"
SUBTITLE = "YOUR WEEKEND ON THE BAY"


def font(name, size):
    return ImageFont.truetype(f"{FONT}/{name}", size)


def text_width(text, fnt, tracking):
    if not text:
        return 0
    return sum(fnt.getlength(ch) for ch in text) + tracking * (len(text) - 1)


def render_tracked(text, fnt, fill, tracking):
    pad = 8
    width = int(np.ceil(text_width(text, fnt, tracking))) + pad * 2
    height = fnt.size * 3
    im = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    x = pad
    y = fnt.size
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor="ls")
        x += fnt.getlength(ch) + tracking
    bbox = im.getbbox()
    if bbox is None:
        raise SystemExit(f"no ink for {text!r}")
    return im.crop(bbox)


def load_mark(width):
    mark = Image.open(MARK).convert("RGBA")
    alpha = mark.split()[-1]
    bbox = alpha.getbbox()
    mark = mark.crop(bbox)
    height = max(1, round(mark.height * width / mark.width))
    return mark.resize((width, height), Image.Resampling.LANCZOS)


def stack(items, gaps):
    width = max(im.width for im, _ in items)
    height = sum(im.height for im, _ in items) + sum(gaps)
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    y = 0
    for (im, _align), gap in zip(items, gaps + [0]):
        layer.alpha_composite(im, (0, y))
        y += im.height + gap
    return layer


def smoothstep(t):
    return t * t * (3 - 2 * t)


def grade(photo):
    photo = ImageEnhance.Contrast(photo).enhance(1.05)
    photo = ImageEnhance.Color(photo).enhance(1.03)
    return photo.filter(ImageFilter.UnsharpMask(radius=1.1, percent=42, threshold=3))


def cover_photo(box, out_size):
    """Cover-crop the hero into out_size from a source box (l, t, r, b)."""
    src = Image.open(HERO).convert("RGB").crop(box)
    tw, th = out_size
    scale = max(tw / src.width, th / src.height)
    resized = src.resize((round(src.width * scale), round(src.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - tw) // 2)
    top = max(0, (resized.height - th) // 2)
    photo = resized.crop((left, top, left + tw, top + th))
    return grade(photo)


def lay_navy(photo, origin_x, fade_start, fade_end, canvas):
    """Place photo at (origin_x, 0) on a navy canvas and fade the left edge."""
    cw, ch = canvas
    base = Image.new("RGB", canvas, NAVY)
    base.paste(photo, (origin_x, 0))
    arr = np.asarray(base).astype(np.float32)
    xs = np.arange(cw, dtype=np.float32)
    span = max(1.0, float(fade_end - fade_start))
    t = np.clip((xs - fade_start) / span, 0.0, 1.0)
    t = smoothstep(t)
    alpha = np.where(xs < fade_start, 1.0, 1.0 - t).astype(np.float32)
    alpha = np.where(xs < origin_x, 1.0, alpha)
    navy = np.array(NAVY, dtype=np.float32)
    comp = arr * (1 - alpha)[None, :, None] + navy * alpha[None, :, None]
    return Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8), mode="RGB")


def ink_bbox(layer):
    alpha = np.asarray(layer.split()[-1])
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def build_lockup(mark_w, tag_size, tag_track, exp_size, exp_track, sub_size, sub_track, rule_w):
    mark = load_mark(mark_w)
    tag = render_tracked(TAGLINE, font("Outfit-Medium.ttf", tag_size), CHAMPAGNE + (255,), tag_track)
    rule = Image.new("RGBA", (rule_w, 2), CHAMPAGNE + (255,))
    exp = render_tracked(EXPERIENCE, font("Cinzel-Medium.ttf", exp_size), IVORY + (255,), exp_track)
    sub = render_tracked(SUBTITLE, font("Outfit-Medium.ttf", sub_size), IVORY + (255,), sub_track)
    gaps = [16, 18, 22, 14]
    return stack([(mark, 0), (tag, 0), (rule, 0), (exp, 0), (sub, 0)], gaps)


def compose(canvas, photo_box, photo_size, origin_x, fade_start, fade_end, lockup, lockup_xy):
    photo = cover_photo(photo_box, photo_size)
    card = lay_navy(photo, origin_x, fade_start, fade_end, canvas).convert("RGBA")
    layer = Image.new("RGBA", canvas, (0, 0, 0, 0))
    layer.alpha_composite(lockup, lockup_xy)
    card.alpha_composite(layer)
    return card.convert("RGB"), ink_bbox(layer)


def render_og():
    canvas = (1200, 630)
    # Full approved frame, height-filling, right-aligned. Left water falls into the navy.
    photo_h = 630
    photo_w = round(668 * photo_h / 404)
    origin_x = canvas[0] - photo_w
    lockup = build_lockup(
        mark_w=268,
        tag_size=13,
        tag_track=2.55,
        exp_size=46,
        exp_track=2.4,
        sub_size=15,
        sub_track=2.35,
        rule_w=42,
    )
    # Vertically center the lockup; keep it on the solid navy.
    x = 68
    y = (canvas[1] - lockup.height) // 2
    fade_start = x + lockup.width + 36
    fade_end = fade_start + 250
    card, bbox = compose(
        canvas,
        (0, 0, 668, 404),
        (photo_w, photo_h),
        origin_x,
        fade_start,
        fade_end,
        lockup,
        (x, y),
    )
    print("OG lockup", lockup.size, "at", (x, y), "ink", bbox, "fade", fade_start, fade_end, "photo_x", origin_x)
    return card, bbox


def render_banner():
    canvas = (1200, 264)
    # A horizontal slice through canvas, cabin, and hull — same photograph, not a new boat.
    # Source window keeps the yacht recognizable inside a 264px band.
    src_box = (0, 42, 668, 262)  # 220px tall
    photo_h = 264
    photo_w = round((src_box[2] - src_box[0]) * photo_h / (src_box[3] - src_box[1]))
    origin_x = canvas[0] - photo_w
    lockup = build_lockup(
        mark_w=196,
        tag_size=11,
        tag_track=1.85,
        exp_size=26,
        exp_track=1.7,
        sub_size=12,
        sub_track=1.55,
        rule_w=32,
    )
    x = 48
    # Sit above the midline. Top margin is comfortable; bottom stays out of the lower fifth.
    y = 32
    fade_start = max(origin_x, x + lockup.width + 28)
    fade_end = min(canvas[0] - 80, fade_start + 220)
    card, bbox = compose(
        canvas,
        src_box,
        (photo_w, photo_h),
        origin_x,
        fade_start,
        fade_end,
        lockup,
        (x, y),
    )
    print("BANNER lockup", lockup.size, "at", (x, y), "ink", bbox, "fade", fade_start, fade_end, "photo", photo_w, origin_x)
    return card, bbox


def check_og(bbox, size):
    x0, y0, x1, y1 = bbox
    w, h = size
    problems = []
    if x0 < 36 or y0 < 36 or x1 > w - 36 or y1 > h - 36:
        problems.append(f"og ink near edge {bbox}")
    if x1 > w * 0.62:
        problems.append(f"og ink too wide {x1}")
    return problems


def check_banner(bbox, size):
    x0, y0, x1, y1 = bbox
    w, h = size
    problems = []
    if x1 >= w / 2:
        problems.append(f"banner ink in right half x1={x1}")
    if y1 >= h * 0.8:
        problems.append(f"banner ink in bottom fifth y1={y1}")
    if y0 < 20:
        problems.append(f"banner ink edge-hugs top y0={y0}")
    if x0 < 28:
        problems.append(f"banner ink edge-hugs left x0={x0}")
    center = (y0 + y1) / 2
    if center >= h / 2:
        problems.append(f"banner lockup center {center} not above midline {h/2}")
    return problems


if __name__ == "__main__":
    og, og_box = render_og()
    ban, ban_box = render_banner()
    problems = check_og(og_box, og.size) + check_banner(ban_box, ban.size)
    og.save("/workspace/.grok/og-render.png")
    ban.save("/workspace/.grok/x-banner-render.png")
    og.resize((600, 315), Image.Resampling.LANCZOS).save("/workspace/.grok/preview/og-thumb.jpg", quality=90)
    ban.resize((600, 132), Image.Resampling.LANCZOS).save("/workspace/.grok/preview/banner-thumb.jpg", quality=90)
    if problems:
        print("PROBLEMS")
        for p in problems:
            print(" -", p)
        raise SystemExit(1)
    print("ok", og.size, ban.size)
