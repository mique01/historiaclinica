'use client';
import { useState } from 'react';

export default function OrgStaffPage() {
  const [email, setEmail] = useState('');
  return <div><h1 className="text-2xl font-serif">Gestionar staff</h1><div className="mt-4 flex gap-2"><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" /><button className="btn btn-primary" onClick={()=>fetch('/api/org/invite',{method:'POST',body:JSON.stringify({email})})}>Invitar</button></div></div>;
}
