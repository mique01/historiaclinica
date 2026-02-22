import Link from 'next/link';
import type { ReactNode } from 'react';
import type { AppRole } from '@/types/contracts';

const navByRole: Record<AppRole, Array<{ href: string; label: string }>> = {
  patient: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/timeline', label: 'Mi historia' },
    { href: '/documents', label: 'Documentos' },
    { href: '/upload', label: 'Subir estudio' },
    { href: '/inbox', label: 'Inbox email' },
    { href: '/sharing', label: 'Compartir' },
    { href: '/audit', label: 'Auditoría' },
  ],
  provider: [
    { href: '/provider/patients', label: 'Mis pacientes' },
    { href: '/provider/encounters/new', label: 'Nueva consulta' },
  ],
  org_admin: [
    { href: '/org/staff', label: 'Staff' },
    { href: '/org/settings', label: 'Configuración' },
  ],
};

export function AppShell({ role, children }: { role: AppRole; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r border-stone-200 bg-white p-4">
        <h2 className="mb-4 font-serif text-lg">Historia Clínica</h2>
        <nav className="space-y-2">
          {navByRole[role].map((item) => (
            <Link key={item.href} className="block rounded px-2 py-1 hover:bg-stone-100" href={item.href}>{item.label}</Link>
          ))}
          <form action="/api/auth/logout" method="post"><button className="btn btn-secondary mt-4 w-full">Salir</button></form>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
