#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_SCRIPT="$ROOT_DIR/scripts/fork-build-local.sh"

usage() {
  echo "Usage: bash scripts/fork-push-local.sh <fork-remote-or-url> [branch]"
  echo ""
  echo "Examples:"
  echo "  bash scripts/fork-push-local.sh myfork"
  echo "  bash scripts/fork-push-local.sh git@github.com:you/continue.git"
  echo "  RUN_BUILD=0 bash scripts/fork-push-local.sh myfork local-ollama-fork"
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

FORK_INPUT="$1"
BRANCH="${2:-$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD)}"
RUN_BUILD="${RUN_BUILD:-1}"
REMOTE_NAME="fork"

cd "$ROOT_DIR"

if [[ "$FORK_INPUT" =~ ^https?:// || "$FORK_INPUT" =~ ^git@ ]]; then
  if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
    git remote set-url "$REMOTE_NAME" "$FORK_INPUT"
  else
    git remote add "$REMOTE_NAME" "$FORK_INPUT"
  fi
else
  REMOTE_NAME="$FORK_INPUT"
  if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
    echo "ERROR: Remote '$REMOTE_NAME' does not exist."
    echo "Add it first with: git remote add $REMOTE_NAME <your-fork-url>"
    exit 1
  fi
fi

if [[ "$RUN_BUILD" == "1" ]]; then
  echo "==> Building artifacts before push"
  bash "$BUILD_SCRIPT"
else
  echo "==> Skipping artifact build (RUN_BUILD=0)"
fi

echo "==> Staging changes"
git add -A

if git diff --cached --quiet; then
  echo "==> No staged changes to commit"
else
  echo "==> Creating commit"
  git commit -m "Local Ollama fork: remove paid restrictions and package artifacts"
fi

echo "==> Pushing branch '$BRANCH' to remote '$REMOTE_NAME'"
git push "$REMOTE_NAME" "$BRANCH:$BRANCH"

echo ""
echo "DONE"
echo "Remote: $REMOTE_NAME"
echo "Branch: $BRANCH"
echo "Artifacts: $ROOT_DIR/fork-artifacts"
