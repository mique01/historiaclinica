import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function ensureUser(email: string, password: string, role: 'patient'|'provider'|'org_admin') {
  const created = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: email.split('@')[0] } });
  const user = created.data.user!;
  await supabase.from('profiles').update({ role }).eq('id', user.id);
  return user.id;
}

async function main() {
  const { data: tenant } = await supabase.from('tenants').insert({ name: 'Tenant Demo', branding: { color: '#1a5c46' } }).select().single();
  const { data: org } = await supabase.from('organizations').insert({ tenant_id: tenant!.id, name: 'Clínica Demo' }).select().single();
  const patientUserId = await ensureUser('patient.demo@example.com', 'Demo12345!', 'patient');
  const providerUserId = await ensureUser('provider.demo@example.com', 'Demo12345!', 'provider');
  const orgAdminId = await ensureUser('admin.demo@example.com', 'Demo12345!', 'org_admin');
  await supabase.from('profiles').update({ tenant_id: tenant!.id, organization_id: org!.id }).in('id', [patientUserId, providerUserId, orgAdminId]);
  const { data: patient } = await supabase.from('patients').insert({ user_id: patientUserId, tenant_id: tenant!.id, display_name: 'Paciente Demo', dob: '1988-05-12', blood_type: 'A+' }).select().single();
  await supabase.from('provider_profiles').insert({ user_id: providerUserId, organization_id: org!.id, license_id: 'MN 12345', specialty: 'Clínica Médica' });
  await supabase.from('access_grants').insert({ patient_id: patient!.id, provider_user_id: providerUserId, scope: 'READ_WRITE' });
  await supabase.from('documents').insert({ patient_id: patient!.id, uploaded_by: patientUserId, source: 'PATIENT', doc_type: 'lab', title: 'Análisis inicial', document_date: '2025-06-01', storage_path: `patient/${patient!.id}/seed-lab.pdf`, mime: 'application/pdf', size: 20000 });
  await supabase.from('encounters').insert({ patient_id: patient!.id, provider_user_id: providerUserId, reason: 'Consulta inicial' });
  const { data: msg } = await supabase.from('inbox_messages').insert({ patient_id: patient!.id, sender_email: 'lab@demo.com', subject: 'Resultados laboratorio' }).select().single();
  await supabase.from('inbox_attachments').insert({ message_id: msg!.id, filename: 'lab_demo.pdf', mime: 'application/pdf', size: 1000, status: 'PENDING', suggested_type: 'lab' });
  await supabase.from('audit_events').insert({ patient_id: patient!.id, actor_user_id: patientUserId, actor_role: 'patient', event_type: 'SEED_CREATED', item_type: 'seed', metadata: {} });
  console.log('Seed completo');
}

main();
