# motion

Монтаж, моушн, звук, 3D и субтитры.

## Структура
- `video/` — проект Remotion (React → видео)
  - `npm run dev` — студия предпросмотра
  - `npx remotion render` — рендер
  - `scripts/setup-whisper.sh [model]` — whisper.cpp + модель для субтитров

## Установлено
- **Remotion 4** + `@remotion/captions`, `install-whisper-cpp`, `media`, `media-utils`,
  `three` (+ three, @react-three/fiber, drei), `transitions`, `shapes`, `paths`,
  `noise`, `motion-blur`, `google-fonts`, `layout-utils`, `lottie`
- **Системные:** ffmpeg, Blender 4 (bpy), SoX, ImageMagick, MediaInfo
- **Python:** faster-whisper, librosa, pydub, soundfile, pyloudnorm, auditok

## Субтитры из командной строки
```bash
video/whisper.cpp/main -m video/whisper.cpp/ggml-medium.bin -f audio16k.wav -l auto -osrt -of out
```
