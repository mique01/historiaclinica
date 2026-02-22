'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const upload = async () => {
    if (!file) return;
    const presign = await fetch('/api/storage/presign-upload', { method: 'POST', body: JSON.stringify({ filename: file.name, contentType: file.type }) }).then(r=>r.json());
    await fetch(presign.signedUrl, { method: 'PUT', body: file, headers: { 'content-type': file.type } });
  };
  return <div><h1 className="text-2xl font-serif">Subir documento</h1><input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} className="mt-4" /><button onClick={upload} className="btn btn-primary ml-2">Subir</button></div>;
}
