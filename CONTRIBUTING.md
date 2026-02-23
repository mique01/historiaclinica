# Contribuir sin conflictos de PR

Para evitar conflictos recurrentes, seguí este flujo **siempre**:

## 1) Crear rama desde `main` actualizado
```bash
git checkout main
git pull origin main
git checkout -b fix/mi-cambio
```

## 2) Antes de pushear, rebasear
```bash
./scripts/sync-with-main.sh
```

## 3) Verificar localmente antes del PR
```bash
npm run typecheck
npm run guard:conflicts
npm run guard:lint
npm run guard:regressions
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy \
SUPABASE_SERVICE_ROLE_KEY=dummy \
INBOX_INGEST_TOKEN=dummy \
NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
npm run build
```

## 4) PR chico y atómico
Un PR = un problema. Evitá mezclar refactors grandes con fixes de build.

## 5) Guardrails automáticos
Este repo incluye:
- `CI` workflow (typecheck + build)
- `PR up-to-date guard` que falla si tu rama no contiene la última base.

Si falla el guard, corré:
```bash
git fetch origin
git rebase origin/main
```
