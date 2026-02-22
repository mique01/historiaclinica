'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push('/dashboard');
  };
  return <main className="mx-auto mt-20 max-w-md card"><h1 className="mb-4 text-2xl font-serif">Ingresar</h1><form onSubmit={onSubmit} className="space-y-3"><input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><input className="input" type="password" placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="btn btn-primary w-full">Ingresar</button></form></main>;
}
