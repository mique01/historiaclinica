#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-origin/main}"

git fetch origin "${BASE_REF#origin/}" --quiet || true

if git merge-base --is-ancestor "$BASE_REF" HEAD; then
  echo "Branch is up-to-date with $BASE_REF"
  exit 0
fi

echo "Branch is behind $BASE_REF. Run: git fetch origin && git rebase $BASE_REF"
exit 1
