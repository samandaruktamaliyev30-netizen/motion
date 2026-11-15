# Remove the burnt-in (CapCut-style) captions from the source video by inpainting
# thin white/grey text strokes in the chest band. Usage: detext.py in.mp4 out.mp4 [preview_secs...]
import sys, subprocess, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
W, H = 1080, 1920
Y0, Y1, X0, X1 = 1290, 1530, 60, 1020
K = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))

def clean(fr):
    band = fr[Y0:Y1, X0:X1]
    g = cv2.cvtColor(band, cv2.COLOR_BGR2GRAY)
    th = cv2.morphologyEx(g, cv2.MORPH_TOPHAT, K)
    b = band.astype(np.int16)
    sat = b.max(2) - b.min(2)
    # bright thin strokes (white / half-faded grey text)
    m1 = (th > 9) & (sat < 38) & (g > 38)
    # faint text over skin: locally brighter AND less saturated than its surroundings
    med = cv2.medianBlur(g, 21)
    smed = cv2.medianBlur(np.clip(sat, 0, 255).astype(np.uint8), 21).astype(np.int16)
    m2 = ((g.astype(np.int16) - med) > 10) & (sat < smed * 0.8)
    m = (m1 | m2).astype(np.uint8) * 255
    # keep only text-like blobs (remove isolated speckles / big shapes)
    m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=2)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if a >= 20 and h <= 200 and not (h > 25 and h > 1.4 * w):
            keep[lab == i] = 255
    keep = cv2.dilate(keep, np.ones((3, 3), np.uint8), iterations=2)
    fr[Y0:Y1, X0:X1] = cv2.inpaint(band, keep, 6, cv2.INPAINT_TELEA)
    return fr

if len(sys.argv) > 3:
    cap = cv2.VideoCapture(src)
    outs = []
    for s in sys.argv[3:]:
        cap.set(cv2.CAP_PROP_POS_MSEC, float(s) * 1000)
        ok, fr = cap.read()
        a = fr[1200:1600].copy(); b = clean(fr)[1200:1600]
        outs.append(np.vstack([a, b]))
    cv2.imwrite(dst, cv2.resize(np.vstack(outs), None, fx=0.5, fy=0.5))
    sys.exit()

dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", "30",
                        "-i", "-", "-i", src, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", dst], stdin=subprocess.PIPE)
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
    enc.stdin.write(clean(fr).tobytes())
enc.stdin.close(); enc.wait()
