'use client';
import { useEffect, useState } from 'react';

export default function SharingPage() {
  const [email, setEmail] = useState('');
  const [grants, setGrants] = useState<any[]>([]);
  const reload = async () => setGrants(await fetch('/api/sharing/grants').then(r=>r.json()));
  useEffect(() => { reload(); }, []);
  return <div><h1 className="text-2xl font-serif">Compartir</h1><div className="mt-3 flex gap-2"><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="medico@x.com" /><button className="btn btn-primary" onClick={async()=>{await fetch('/api/sharing/grants',{method:'POST',body:JSON.stringify({providerEmail:email,scope:'READ'})});setEmail('');reload();}}>Crear grant</button></div><div className="mt-4 space-y-2">{grants.map(g=><div key={g.id} className="card flex justify-between"><span>{g.provider_user_id} · {g.scope}</span><button className="btn btn-secondary" onClick={()=>fetch(`/api/sharing/grants/${g.id}/revoke`,{method:'POST'}).then(reload)}>Revocar</button></div>)}</div></div>;
}
