#!/usr/bin/env bash
set -euo pipefail

# 1) Ensure patched Next.js line is pinned
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
if [[ "$NEXT_VERSION" != "15.5.12" ]]; then
  echo "Expected next=15.5.12, found $NEXT_VERSION"
  exit 1
fi

# 2) Ensure admin helper export exists (prevents broken imports in API routes)
if ! rg -n "^export function getAdminClient\(" src/lib/supabase/admin.ts >/dev/null; then
  echo "getAdminClient export missing in src/lib/supabase/admin.ts"
  exit 1
fi

# 3) Ensure patient lookup unsafe pattern is not reintroduced
if rg -n "from\('patients'\).*\.single\(" app src >/dev/null; then
  echo "Unsafe patients .single() usage detected. Use maybeSingle()/helper with guards."
  rg -n "from\('patients'\).*\.single\(" app src
  exit 1
fi

echo "Regression guards passed."
