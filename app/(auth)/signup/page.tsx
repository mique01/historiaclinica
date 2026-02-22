'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <main className="mx-auto mt-20 max-w-md card"><h1 className="mb-4 text-2xl font-serif">Crear cuenta</h1><form className="space-y-3" onSubmit={async(e)=>{e.preventDefault(); await createClient().auth.signUp({email,password});}}><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} /><input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="btn btn-primary w-full">Registrarme</button></form></main>;
}
