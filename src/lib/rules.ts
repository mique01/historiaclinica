export function providerCanRead(hasGrant: boolean) { return hasGrant; }
export function patientDocsVisible(docCount: number) { return docCount >= 0; }
export function acceptInbox(statusBefore: 'PENDING'|'ACCEPTED'|'REJECTED') {
  return { statusAfter: 'ACCEPTED' as const, documentCreated: statusBefore === 'PENDING' };
}
