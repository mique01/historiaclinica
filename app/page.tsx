import Link from 'next/link';

export default function Home() {
  return <main className="mx-auto max-w-3xl p-10"><h1 className="text-4xl font-serif">Historia Clínica</h1><p className="mt-4 text-stone-600">MVP centrado en paciente migrado a Next.js + Supabase.</p><div className="mt-6"><Link className="btn btn-primary" href="/login">Ingresar</Link></div></main>;
}
