#!/usr/bin/env bash
# Builds whisper.cpp (for @remotion/install-whisper-cpp) and downloads a model.
# Usage: scripts/setup-whisper.sh [model]   (default: medium; e.g. small, large-v3-turbo)
set -euo pipefail
cd "$(dirname "$0")/.."
MODEL="${1:-medium}"
DIR="whisper.cpp"
node -e "require('@remotion/install-whisper-cpp').installWhisperCpp({to: require('path').resolve('$DIR'), version: '1.5.5'})"
FILE="$DIR/ggml-$MODEL.bin"
if [ ! -s "$FILE" ]; then
  # curl honours HTTPS_PROXY (Node fetch does not), so download the model with it.
  curl -fSL --retry 4 -o "$FILE" "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-$MODEL.bin"
fi
echo "Whisper ready: $FILE"
