#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
if ! command -v firebase >/dev/null 2>&1; then
  echo "firebase CLI not found. Install via npm install -g firebase-tools"
  exit 1
fi
firebase deploy --only hosting
