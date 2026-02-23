#!/usr/bin/env bash
set -euo pipefail
if rg -n "^(<<<<<<<|=======|>>>>>>>)" app src .github scripts --glob '*.{ts,tsx,js,mjs,json,md,yml,yaml,sh}' >/dev/null; then
  echo "Conflict markers found. Resolve merge conflicts before pushing."
  rg -n "^(<<<<<<<|=======|>>>>>>>)" app src .github scripts --glob '*.{ts,tsx,js,mjs,json,md,yml,yaml,sh}'
  exit 1
fi

echo "No conflict markers found."
