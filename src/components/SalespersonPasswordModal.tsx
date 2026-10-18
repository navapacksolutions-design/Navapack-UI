import React, { useEffect, useRef, useState } from 'react';
import { authenticatedFetch } from '../services/tokenAuth';

export function SalespersonPasswordModal({ person, onClose }: { person: { id: number | string; name: string }; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); previous?.focus(); };
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current) return;
    setError('');
    if (!password || password !== confirm) { setError('Enter a new password and matching confirmation.'); return; }
    busy.current = true;
    setSaving(true);
    try {
      const response = await authenticatedFetch('https://api.navapacksolutions.com/api/salespersons/' + person.id + '/password/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: password, confirm_password: confirm }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(Object.values(payload).flat().join(' ') || 'Could not update password.');
      setPassword(''); setConfirm(''); setSuccess(payload.message);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not update password.'); }
    finally { busy.current = false; setSaving(false); }
  }
  return <dialog ref={dialog} aria-labelledby="salesperson-password-title" onCancel={event => { event.preventDefault(); if (!saving) onClose(); }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl p-6 bg-white text-slate-900 shadow-xl backdrop:bg-slate-900/50">
    <h3 id="salesperson-password-title" className="font-bold text-lg mb-4">Update password: {person.name}</h3>
    {success ? <p role="status">{success}</p> : <form onSubmit={submit} className="space-y-4">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <label className="block">New password<input autoFocus type="password" autoComplete="new-password" required maxLength={128} value={password} onChange={event => setPassword(event.target.value)} disabled={saving} className="block w-full border rounded p-2" /></label>
      <label className="block">Confirm new password<input type="password" autoComplete="new-password" required maxLength={128} value={confirm} onChange={event => setConfirm(event.target.value)} disabled={saving} className="block w-full border rounded p-2" /></label>
      <button type="submit" disabled={saving} className="bg-sky-700 text-white rounded px-4 py-2 disabled:opacity-50">{saving ? 'Updating…' : 'Update password'}</button>
    </form>}
    <button type="button" disabled={saving} onClick={onClose} className="mt-4 border rounded px-4 py-2">{success ? 'Close' : 'Cancel'}</button>
  </dialog>;
}
