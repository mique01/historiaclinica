import { describe, expect, it } from 'vitest';
import { acceptInbox, patientDocsVisible, providerCanRead } from '@/lib/rules';

describe('integraciones mínimas', () => {
  it('provider sin grant no puede leer paciente', () => {
    expect(providerCanRead(false)).toBe(false);
  });

  it('patient ve sus docs', () => {
    expect(patientDocsVisible(3)).toBe(true);
  });

  it('accept inbox attachment crea document y cambia status', () => {
    const result = acceptInbox('PENDING');
    expect(result.statusAfter).toBe('ACCEPTED');
    expect(result.documentCreated).toBe(true);
  });
});
