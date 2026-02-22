export type AppRole = 'patient' | 'provider' | 'org_admin';
export type GrantScope = 'READ' | 'READ_WRITE';
export type DocumentSource = 'PATIENT' | 'PROVIDER' | 'INBOX';
export type InboxAttachmentStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Patient {
  id: string;
  userId: string | null;
  displayName: string;
  dob: string;
  bloodType: string | null;
  allergies: string[];
  conditions: string[];
  demographics?: Record<string, unknown>;
}

export interface Document {
  id: string;
  patientId: string;
  uploadedBy: string;
  source: DocumentSource;
  docType: string;
  title: string;
  documentDate: string;
  storagePath: string;
  mime: string;
  size: number;
}

export interface Encounter {
  id: string;
  patientId: string;
  providerUserId: string;
  occurredAt: string;
  reason: string;
  diagnosisText: string | null;
  notes: string | null;
  icd10: string | null;
}

export interface AccessGrant {
  id: string;
  patientId: string;
  providerUserId: string;
  scope: GrantScope;
  expiresAt: string | null;
  revokedAt: string | null;
}

export interface AuditEvent {
  id: string;
  patientId: string;
  actorUserId: string;
  actorRole: AppRole;
  eventType: string;
  itemType: string;
  itemId: string | null;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export interface InboxAttachment {
  id: string;
  messageId: string;
  filename: string;
  mime: string;
  size: number;
  storagePath: string | null;
  suggestedType: string | null;
  status: InboxAttachmentStatus;
}

export interface InboxMessage {
  id: string;
  patientId: string;
  senderEmail: string;
  subject: string;
  bodyText: string | null;
  receivedAt: string;
  unread: boolean;
  attachments: InboxAttachment[];
}

export interface FakeApiContract {
  getPatient(id: string): Promise<Patient | null>;
  getTimeline(patientId: string): Promise<Array<Document | Encounter>>;
  getDocuments(patientId: string): Promise<Document[]>;
  getMedications(patientId: string): Promise<Array<Record<string, unknown>>>;
  getAccessGrants(patientId: string): Promise<AccessGrant[]>;
  getAuditLog(patientId: string): Promise<AuditEvent[]>;
  getInbox(patientId: string): Promise<InboxMessage[]>;
  getProviderPatients(providerUserId: string): Promise<Patient[]>;
  createEncounter(payload: Partial<Encounter>): Promise<Encounter>;
  uploadDocument(payload: Partial<Document>): Promise<Document>;
  createAccessGrant(payload: Partial<AccessGrant>): Promise<AccessGrant>;
  revokeAccessGrant(grantId: string): Promise<void>;
  acceptInboxAttachment(messageId: string, attachmentId: string, patientId: string, category: string): Promise<void>;
  dismissInboxAttachment(messageId: string, attachmentId: string): Promise<void>;
}
