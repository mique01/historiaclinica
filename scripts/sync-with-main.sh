#!/usr/bin/env bash
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "main" ]]; then
  echo "Estás en main. Cambiá a una rama de trabajo antes de continuar."
  exit 1
fi

echo "Fetching origin/main..."
git fetch origin main

echo "Rebasing $BRANCH onto origin/main..."
git rebase origin/main

echo "OK: rama actualizada sobre main."
