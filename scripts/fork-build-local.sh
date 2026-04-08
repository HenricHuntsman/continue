#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/fork-artifacts"
ZIP_PATH="$OUT_DIR/continue-fork-local-ollama.zip"

mkdir -p "$OUT_DIR"

printf "\n==> Root: %s\n" "$ROOT_DIR"
printf "==> Output: %s\n\n" "$OUT_DIR"

printf "==> Installing root dependencies\n"
cd "$ROOT_DIR"
npm install

printf "\n==> Installing and building CLI\n"
cd "$ROOT_DIR/extensions/cli"
npm install
npm run build

printf "\n==> Installing and packaging VS Code extension (.vsix)\n"
cd "$ROOT_DIR/extensions/vscode"
npm install
npm run package

VSIX_PATH="$(find "$ROOT_DIR/extensions/vscode" -maxdepth 2 -type f -name "*.vsix" | head -n 1 || true)"
if [[ -z "$VSIX_PATH" ]]; then
  echo "ERROR: VSIX not found after packaging." >&2
  exit 1
fi

printf "\n==> Creating source zip (excluding heavy/generated dirs)\n"
cd "$ROOT_DIR"
zip -r "$ZIP_PATH" . \
  -x ".git/*" \
     "**/node_modules/*" \
     "**/.next/*" \
     "**/dist/*" \
     "**/build/*" \
     "**/out/*" \
     "**/.turbo/*" \
     "**/.cache/*" \
     "**/.DS_Store"

printf "\n==> Copying VSIX artifact\n"
cp "$VSIX_PATH" "$OUT_DIR/"

printf "\nDONE\n"
printf "Zip:  %s\n" "$ZIP_PATH"
printf "VSIX: %s\n" "$OUT_DIR/$(basename "$VSIX_PATH")"
printf "\nUpload these from fork-artifacts to your GitHub release/repo.\n"
