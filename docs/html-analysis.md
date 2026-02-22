# Paso 1 — Análisis de `historia-clinica.html`

## Pantallas/rutas detectadas
- Landing pública y login demo.
- Patient: `dashboard`, `timeline`, `documents`, `upload`, `inbox`, `sharing`, `audit`.
- Provider: `pro-dashboard`, `pro-patients`, `pro-patient-detail`, `pro-encounter`.
- Org admin: `org-dashboard`, `org-staff`, `org-settings`.

## Componentes principales
- `AppShell` con sidebar/topbar por rol.
- Componentes utilitarios: `RoleBadge`, `SourceBadge`, `EventBadge`, `EmptyState`, `Modal`, `Drawer`, `UploadDropzone`.
- Páginas de paciente/proveedor/admin con tablas, cards y tabs.

## Contrato fake API extraído
Funciones existentes en el prototipo:
- `getPatient(id)`
- `getTimeline(patientId)`
- `getDocuments(patientId)`
- `getMedications(patientId)`
- `getAccessGrants(patientId)`
- `getAuditLog(patientId)`
- `getInbox(patientId)`
- `getProviderPatients(providerId)`
- `createEncounter(data)`
- `uploadDocument(data)`
- `createAccessGrant(data)`
- `revokeAccessGrant(id)`
- `acceptInboxAttachment(msgId, attId, patientId, category)`
- `dismissInboxAttachment(msgId, attId)`
- `getOrgStats(orgId)`
- `getOrgProviders(orgId)`

## Modelos del prototipo
- Tenant, Organization, Provider, Patient.
- Encounter, Document, Medication.
- AccessGrant, AuditEvent.
- InboxMessage + InboxAttachment.

## Mapping a TypeScript
- Se formalizó en `src/types/contracts.ts` con interfaces para `Patient`, `Document`, `Encounter`, `AccessGrant`, `AuditEvent`, `InboxMessage`, `InboxAttachment`, y `FakeApiContract`.
