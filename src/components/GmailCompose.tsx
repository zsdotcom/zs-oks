import React, { useState } from 'react';
import { Mail, Send, X } from './icons/lucide-shim';
import { getGoogleAccessToken } from '../services/googleAuthService';

interface Props {
  currentFile?: { name: string; content: string };
  userEmail?: string | null;
  onClose: () => void;
}

async function sendGmail(token: string, to: string, subject: string, body: string): Promise<void> {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    body,
  ].join('\r\n');

  const encoded = btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded }),
  });

  if (!res.ok) throw new Error(`Gmail send failed: HTTP ${res.status}`);
}

export const GmailCompose: React.FC<Props> = ({ currentFile, userEmail, onClose }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState(currentFile?.name?.replace(/\.\w+$/, '') || 'Report from Open Knowledge Studio');
  const [body, setBody] = useState(currentFile?.content || '');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    if (!to.trim()) { setStatus('Please enter a recipient'); return; }
    const token = getGoogleAccessToken();
    if (!token) { setStatus('Please sign in to Google first'); return; }
    setSending(true);
    setStatus('Sending...');
    try {
      await sendGmail(token, to, subject, body);
      setStatus('Sent successfully!');
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-[var(--accent)]" />
          <span className="text-sm font-medium">Compose Email</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-hover)]"><X size={14} /></button>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        <div>
          <label className="text-[10px] text-[var(--text-muted)] uppercase" htmlFor="gmail-to">To</label>
          <input id="gmail-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50 mt-1" aria-label="Recipient email" aria-required="true" />
        </div>
        <div>
          <label className="text-[10px] text-[var(--text-muted)] uppercase" htmlFor="gmail-subject">Subject</label>
          <input id="gmail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50 mt-1" aria-label="Email subject" />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase" htmlFor="gmail-body">Body</label>
          <textarea id="gmail-body" value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50 mt-1 resize-none font-mono" rows={15} aria-label="Email body" />
        </div>
        {status && (
          <div className={`text-xs px-3 py-2 rounded ${status.startsWith('Error') ? 'bg-red-500/10 text-red-400' : status.includes('Sent') ? 'bg-green-500/10 text-green-400' : 'bg-[var(--accent-subtler)] text-[var(--accent)]'}`} role="alert" aria-live="polite">
            {status}
          </div>
        )}
        <button onClick={handleSend} disabled={sending || !to.trim()} className="w-full py-2 bg-[var(--accent)] text-white text-xs rounded-lg hover:bg-[var(--accent-dark)] disabled:opacity-50 flex items-center justify-center gap-1">
          <Send size={12} /> {sending ? 'Sending...' : 'Send Email'}
        </button>
        {currentFile && (
          <p className="text-[10px] text-[var(--text-muted)]">Attaching content from: {currentFile.name}</p>
        )}
      </div>
    </div>
  );
};
