import json,sys
S=sys.argv[1]; out=sys.argv[2]
sil=json.load(open(f'{S}/sil.json'))
FPS=30; END=402.75
KEEP=0.07  # seconds of silence kept on each side of a cut
clips=[]; a=0.0
for s,e in sil:
    if s<0.3: a=e-KEEP; continue
    clips.append((a,s+KEEP)); a=e-KEEP
clips.append((a,END))
C=[];o=0
for s,e in clips:
    fs,fe=round(s*FPS),round(e*FPS)
    C.append([fs,fe,o]); o+=fe-fs
with open(out,'w') as f:
    f.write("// AUTO-GENERATED (scripts/gen.py) — speech kept, pauses >0.35 s trimmed.\n")
    f.write("// [sourceStartFrame, sourceEndFrame, outputFrom]\n")
    f.write("export const FPS = 30;\n")
    f.write(f"export const DURATION = {o};\n")
    f.write("export const CLIPS: [number, number, number][] = [\n"+"".join(f"  [{a}, {b}, {c}],\n" for a,b,c in C)+"];\n")
print(len(C),o,o/30)
d=json.load(open(f'{S}/wc.json'))
segs=[round(s['offsets']['from']/1000,2) for s in d['transcription']]
with open(out,'a') as f:
    f.write("// whisper segment starts (source seconds) — used as extra camera cut points\n")
    f.write("export const SEGS = ["+", ".join(str(x) for x in segs)+"];\n")
