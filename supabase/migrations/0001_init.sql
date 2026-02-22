create extension if not exists "pgcrypto";

create type app_role as enum ('patient','provider','org_admin');
create type grant_scope as enum ('READ','READ_WRITE');
create type doc_source as enum ('PATIENT','PROVIDER','INBOX');
create type inbox_attachment_status as enum ('PENDING','ACCEPTED','REJECTED');

create table tenants (id uuid primary key default gen_random_uuid(), name text not null, branding jsonb default '{}', created_at timestamptz default now());
create table organizations (id uuid primary key default gen_random_uuid(), tenant_id uuid references tenants(id), name text not null, created_at timestamptz default now());
create table profiles (id uuid primary key references auth.users(id) on delete cascade, role app_role not null default 'patient', tenant_id uuid references tenants(id), organization_id uuid references organizations(id), display_name text, created_at timestamptz default now());
create table patients (id uuid primary key default gen_random_uuid(), user_id uuid unique references auth.users(id) on delete set null, tenant_id uuid references tenants(id), display_name text not null, dob date, blood_type text, allergies text[] default '{}', conditions text[] default '{}', demographics jsonb default '{}', created_at timestamptz default now());
create table provider_profiles (id uuid primary key default gen_random_uuid(), user_id uuid unique references auth.users(id), organization_id uuid references organizations(id), license_id text, specialty text, created_at timestamptz default now());
create table access_grants (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), provider_user_id uuid not null references auth.users(id), scope grant_scope not null, expires_at timestamptz, revoked_at timestamptz, created_at timestamptz default now());
create table documents (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), uploaded_by uuid not null references auth.users(id), source doc_source not null, doc_type text not null, title text not null, document_date date not null default current_date, storage_path text not null, mime text not null, size bigint not null default 0, checksum text, created_at timestamptz default now());
create table encounters (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), provider_user_id uuid not null references auth.users(id), occurred_at timestamptz not null default now(), reason text not null, diagnosis_text text, notes text, icd10 text, created_at timestamptz default now());
create table medications (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), prescribed_by uuid references auth.users(id), name text not null, dose text, frequency text, started_at date, active boolean default true, created_at timestamptz default now());
create table audit_events (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), actor_user_id uuid not null references auth.users(id), actor_role app_role not null, event_type text not null, item_type text not null, item_id text, metadata jsonb not null default '{}', occurred_at timestamptz default now());
create table inbox_messages (id uuid primary key default gen_random_uuid(), patient_id uuid not null references patients(id), sender_email text not null, subject text not null, body_text text, received_at timestamptz default now(), unread boolean default true, created_at timestamptz default now());
create table inbox_attachments (id uuid primary key default gen_random_uuid(), message_id uuid not null references inbox_messages(id) on delete cascade, filename text not null, mime text not null, size bigint not null default 0, storage_path text, suggested_type text, status inbox_attachment_status default 'PENDING', created_at timestamptz default now());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table patients enable row level security; alter table documents enable row level security; alter table encounters enable row level security; alter table medications enable row level security; alter table access_grants enable row level security; alter table inbox_messages enable row level security; alter table inbox_attachments enable row level security; alter table audit_events enable row level security; alter table provider_profiles enable row level security; alter table profiles enable row level security;

create or replace function public.can_provider_access_patient(p_id uuid) returns boolean language sql stable as $$
  select exists(select 1 from access_grants g where g.patient_id = p_id and g.provider_user_id = auth.uid() and g.revoked_at is null and (g.expires_at is null or g.expires_at > now()));
$$;
create or replace function public.can_provider_write_patient(p_id uuid) returns boolean language sql stable as $$
  select exists(select 1 from access_grants g where g.patient_id = p_id and g.provider_user_id = auth.uid() and g.scope='READ_WRITE' and g.revoked_at is null and (g.expires_at is null or g.expires_at > now()));
$$;

create policy patient_self on patients for select using (user_id = auth.uid());
create policy patient_self_update on patients for update using (user_id = auth.uid());
create policy patient_provider_read on patients for select using (can_provider_access_patient(id));

create policy docs_read on documents for select using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()) or can_provider_access_patient(patient_id));
create policy docs_insert_patient on documents for insert with check (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()));
create policy docs_insert_provider on documents for insert with check (can_provider_write_patient(patient_id));

create policy enc_read on encounters for select using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()) or can_provider_access_patient(patient_id));
create policy enc_insert_provider on encounters for insert with check (can_provider_write_patient(patient_id));

create policy med_read on medications for select using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()) or can_provider_access_patient(patient_id));
create policy grant_patient_rw on access_grants for all using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid())) with check (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()));
create policy inbox_msg_read on inbox_messages for select using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()));
create policy inbox_att_read on inbox_attachments for select using (exists(select 1 from inbox_messages m join patients p on p.id=m.patient_id where m.id = message_id and p.user_id=auth.uid()));
create policy inbox_att_update on inbox_attachments for update using (exists(select 1 from inbox_messages m join patients p on p.id=m.patient_id where m.id = message_id and p.user_id=auth.uid()));
create policy audit_insert on audit_events for insert with check (actor_user_id = auth.uid());
create policy audit_read_patient_provider on audit_events for select using (exists(select 1 from patients p where p.id = patient_id and p.user_id = auth.uid()) or can_provider_access_patient(patient_id));

-- org admin no acceso clínico por defecto: sin policies clínicas adicionales
