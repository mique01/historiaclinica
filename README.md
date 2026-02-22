# Historia Clínica MVP (Next.js + Supabase)

## Stack
- Next.js App Router + TypeScript + Tailwind.
- Supabase Auth + Postgres + RLS + Storage (bucket privado `documents`).

## Variables de entorno
Copiar `.env.example` a `.env.local` y completar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server)
- `INBOX_INGEST_TOKEN` (solo server)
- `NEXT_PUBLIC_SITE_URL`

## Setup Supabase
1. Ejecutar migración `supabase/migrations/0001_init.sql`.
2. Crear bucket privado `documents`.
3. Opcional: policy de storage en SQL/UI para permitir signed URL upload/download (vía server).

## Seed demo
Ejecutar (con envs seteadas):
```bash
node --loader ts-node/esm scripts/seed.ts
```
Credenciales seed:
- `patient.demo@example.com / Demo12345!`
- `provider.demo@example.com / Demo12345!`
- `admin.demo@example.com / Demo12345!`

## Correr local
```bash
npm install
npm run dev
```

## Endpoints server-only
- `POST /api/storage/presign-upload`
- `GET /api/storage/presign-download?documentId=...`
- `POST /api/inbox/ingest` (`X-Inbox-Token` requerido)
- `POST /api/inbox/attachments/:attachmentId/accept`
- `POST /api/inbox/attachments/:attachmentId/reject`
- `GET|POST /api/sharing/grants`
- `POST /api/sharing/grants/:grantId/revoke`
- `POST /api/provider/encounters`
- `POST /api/org/invite`

## Ingest dev (curl)
```bash
curl -X POST http://localhost:3000/api/inbox/ingest \
  -H "Content-Type: application/json" \
  -H "X-Inbox-Token: $INBOX_INGEST_TOKEN" \
  -d '{"patientId":"<uuid>","from":"lab@demo.com","subject":"Lab hematología","attachments":[{"filename":"lab_demo.pdf","mime":"application/pdf","size":1200}]}'
```

## Checklist de flujos
- Paciente: signup/login/logout, dashboard/timeline/documentos, upload manual, sharing, auditoría, inbox accept/reject.
- Provider: login, pacientes con grant activo, acceso a detalle con grant, crear consulta con `READ_WRITE`.
- Org admin: invitar staff/roles sin acceso clínico por defecto.
