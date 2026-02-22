'use client';
import { useState } from 'react';

export default function NewEncounterPage() {
  const [patientId, setPatientId] = useState('');
  const [reason, setReason] = useState('');
  return <div><h1 className="text-2xl font-serif">Nueva consulta</h1><form className="mt-4 space-y-3" onSubmit={async(e)=>{e.preventDefault(); await fetch('/api/provider/encounters',{method:'POST',body:JSON.stringify({patientId,reason})});}}><input className="input" value={patientId} onChange={(e)=>setPatientId(e.target.value)} placeholder="Patient ID" /><input className="input" value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Motivo" /><button className="btn btn-primary">Guardar</button></form></div>;
}
