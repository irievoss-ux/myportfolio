"use client";
import { useState } from 'react';
import { sendEmail } from '@/app/actions';
import { BackArrowIcon, ForwardArrowIcon, RefreshIcon, SearchIcon } from '@/components/VistaIcons';

type View = 'inbox' | 'compose' | 'sent' | 'drafts' | 'junk' | 'deleted';

const inboxEmails = [
  { id: 1, from: 'Windows Live Team', subject: 'Welcome to Windows Live Hotmail!', date: 'Today', preview: 'Thank you for choosing Windows Live Hotmail...', read: true },
  { id: 2, from: 'Irie Voss', subject: 'Portfolio – About Me', date: 'Today', preview: 'Hey! Thanks for checking out my portfolio OS. Feel free to explore everything...', read: false },
  { id: 3, from: 'System Notification', subject: 'Your Vista OS is ready', date: 'Today', preview: 'All system components have been initialized successfully...', read: true },
  { id: 4, from: 'Irie Voss', subject: 'Secret Files Hidden...', date: 'Yesterday', preview: 'I\'ve scattered some interesting files throughout the file system. Try exploring...', read: false },
];

const sentEmails = [
  { id: 10, from: 'You', subject: 'Re: Welcome to Hotmail', date: 'Today', preview: 'Thanks for the welcome email!', read: true },
];

export default function MailWindow() {
  const [view, setView] = useState<View>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'limit' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // The contact form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSend() {
    if (!firstName || !lastName || !email || !message) return;
    setStatus('sending');
    try {
      const result = await sendEmail({ firstName, lastName, email, message });
      if (result.success) {
        setStatus('success');
        setFirstName(''); setLastName(''); setEmail(''); setMessage('');
        setTimeout(() => { setStatus('idle'); setView('sent'); }, 2000);
      } else if (result.error === 'RATE_LIMIT') {
        setStatus('limit');
      } else {
        setErrorMessage(result.error || 'SERVER_ERROR');
        setStatus('error');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Internal Server Error. Please check your Vercel logs.');
      setStatus('error');
    }
  }

  const currentEmails = view === 'sent' ? sentEmails : view === 'inbox' ? inboxEmails : [];
  const selectedMsg = [...inboxEmails, ...sentEmails].find(e => e.id === selectedEmail);

  const folderCounts: Record<string, number> = { inbox: inboxEmails.filter(e => !e.read).length, junk: 0, drafts: 0, sent: sentEmails.length, deleted: 0 };

  return (
    <div className="flex h-full flex-col bg-white text-[12px] text-slate-800 font-[Segoe_UI,sans-serif]">
      {/* IE7 Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#a0b4c8] bg-[linear-gradient(180deg,#def1ff_0%,#b3d4ee_50%,#9ec5e0_100%)] px-2 py-1">
        <div className="flex items-center gap-0.5">
          <IEToolBtn title="Back"><BackArrowIcon size={14} /></IEToolBtn>
          <IEToolBtn title="Forward"><ForwardArrowIcon size={14} /></IEToolBtn>
        </div>
        <div className="mx-1 flex flex-1 items-center rounded-[3px] border border-[#7b9ec0] bg-white px-2 py-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <span className="mr-1 text-slate-400">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2z" stroke="#5a8ab0" strokeWidth="1.2"/><path d="M2 3l6 5 6-5" stroke="#5a8ab0" strokeWidth="1.2"/></svg>
          </span>
          <span className="flex-1 text-[11px] text-slate-600 truncate">http://mail.live.com/mail/InboxLight.aspx</span>
        </div>
        <div className="flex items-center gap-0.5 ml-1">
          <IEToolBtn title="Refresh"><RefreshIcon size={12} /></IEToolBtn>
          <IEToolBtn title="Stop">
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#c03030" strokeWidth="2" strokeLinecap="round" /></svg>
          </IEToolBtn>
          <IEToolBtn title="Search"><SearchIcon size={12} /></IEToolBtn>
        </div>
      </div>

      {/* IE7 Tab bar */}
      <div className="flex items-end border-b border-[#8ca8c4] bg-[linear-gradient(180deg,#c8dff4_0%,#b0cce6_100%)]">
        <div className="flex h-[26px] items-center gap-px px-1">
          <div className="flex items-center gap-1.5 rounded-t-[4px] border border-b-0 border-[#8aaccf] bg-white px-3 py-1 text-[11px] font-medium text-[#20557a]">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2z" stroke="#2a6a9a" strokeWidth="1.2"/><path d="M2 3l6 5 6-5" stroke="#2a6a9a" strokeWidth="1.2"/></svg>
            Windows Live Hotmail
            <span className="ml-2 cursor-pointer text-slate-400 hover:text-slate-600">×</span>
          </div>
        </div>
      </div>

      {/* Hotmail header banner */}
      <div className="flex items-center justify-between border-b border-[#c5d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#e8f0f8_100%)] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold text-[#1d68a2]">Windows Live</span>
          <span className="text-[16px] text-[#f57c00] font-light">Hotmail</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#1d68a2]">
          <span className="cursor-pointer hover:underline">Irie</span>
          <span className="text-slate-400">|</span>
          <span className="cursor-pointer hover:underline">Sign out</span>
        </div>
      </div>

      {/* Hotmail action bar */}
      <div className="flex items-center gap-2 border-b border-[#d0dde8] bg-[#f4f8fc] px-3 py-1.5">
        <button type="button" onClick={() => { setView('compose'); setSelectedEmail(null); }}
          className="flex items-center gap-1.5 rounded-[3px] border border-[#7b9ec0] bg-[linear-gradient(180deg,#f8fbff_0%,#dbe8f4_100%)] px-3 py-1 text-[11px] font-semibold text-[#1d5a8f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 3h10l-5 5z" fill="#1d5a8f" opacity="0.3"/><rect x="2" y="4" width="12" height="9" rx="1" stroke="#1d5a8f" strokeWidth="1.2"/></svg>
          New
        </button>
        <span className="text-slate-300">|</span>
        <button type="button" className="text-[11px] text-[#1d5a8f] hover:underline">Reply</button>
        <button type="button" className="text-[11px] text-[#1d5a8f] hover:underline">Reply all</button>
        <button type="button" className="text-[11px] text-[#1d5a8f] hover:underline">Forward</button>
        <span className="text-slate-300">|</span>
        <button type="button" className="text-[11px] text-[#1d5a8f] hover:underline">Delete</button>
        <button type="button" className="text-[11px] text-[#1d5a8f] hover:underline">Junk</button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Folder sidebar */}
        <aside className="w-[150px] shrink-0 border-r border-[#d0dde8] bg-[#f0f6fc] px-0 py-2 text-[11px]">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Quick views</div>
          {(['inbox', 'junk', 'drafts', 'sent', 'deleted'] as const).map(folder => (
            <button key={folder} type="button" onClick={() => { setView(folder); setSelectedEmail(null); }}
              className={`flex w-full items-center justify-between px-3 py-[4px] text-left capitalize transition-colors ${view === folder ? 'bg-[#cde3f6] font-bold text-[#1d5a8f]' : 'text-[#3a5a7a] hover:bg-[#e2effc]'}`}>
              <span className="flex items-center gap-1.5">
                <FolderSVG type={folder} />
                {folder === 'deleted' ? 'Deleted' : folder === 'junk' ? 'Junk' : folder.charAt(0).toUpperCase() + folder.slice(1)}
              </span>
              {folderCounts[folder] > 0 && <span className="text-[10px] font-bold text-[#1d5a8f]">({folderCounts[folder]})</span>}
            </button>
          ))}
          <div className="mx-3 my-2 border-b border-[#c5d8ea]" />
          <div className="px-3 py-1 text-[10px] text-slate-400">Manage folders</div>
        </aside>

        {/* Email list / compose / reading pane */}
        <section className="flex flex-1 flex-col min-w-0 bg-white">
          {view === 'compose' ? (
            /* Compose view */
            <ComposePane
              firstName={firstName} lastName={lastName} email={email} message={message}
              setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} setMessage={setMessage}
              status={status} errorMessage={errorMessage} onSend={handleSend} onCancel={() => setView('inbox')}
            />
          ) : selectedMsg ? (
            /* Reading pane */
            <div className="flex flex-col h-full">
              <div className="border-b border-[#d0dde8] bg-[#f8fafc] px-4 py-3">
                <div className="text-[14px] font-bold text-[#1d5a8f]">{selectedMsg.subject}</div>
                <div className="mt-1 text-[11px] text-slate-500">From: <span className="font-medium text-slate-700">{selectedMsg.from}</span> · {selectedMsg.date}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 text-[12px] text-slate-700 leading-relaxed">
                <p>{selectedMsg.preview}</p>
                <p className="mt-4 text-slate-400 text-[11px]">— End of message —</p>
              </div>
              <div className="border-t border-[#d0dde8] bg-[#f4f8fc] px-3 py-2 flex gap-2">
                <button type="button" onClick={() => setSelectedEmail(null)} className="text-[11px] text-[#1d5a8f] hover:underline">← Back to {view}</button>
              </div>
            </div>
          ) : (
            /* Email list */
            <div className="flex flex-col h-full">
              <div className="border-b border-[#d0dde8] bg-[#f4f8fc] px-3 py-1.5 text-[11px] font-bold text-[#1d5a8f] capitalize">
                {view} {folderCounts[view] > 0 && `(${folderCounts[view]})`}
              </div>
              <div className="flex-1 overflow-y-auto">
                {currentEmails.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-slate-400 text-[12px]">
                    There are no messages in this folder.
                  </div>
                ) : (
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-[#d0dde8] bg-[#eef4fa] text-[10px] text-slate-500">
                        <th className="w-6 px-1 py-1.5" />
                        <th className="px-2 py-1.5 text-left font-semibold">From</th>
                        <th className="px-2 py-1.5 text-left font-semibold">Subject</th>
                        <th className="w-20 px-2 py-1.5 text-right font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmails.map(e => (
                        <tr key={e.id} onClick={() => setSelectedEmail(e.id)}
                          className={`cursor-pointer border-b border-[#eef2f6] transition-colors ${e.read ? 'hover:bg-[#f0f6fc]' : 'bg-[#fffde8] font-bold hover:bg-[#f5f3d4]'}`}>
                          <td className="px-1 text-center">{!e.read && <span className="inline-block h-2 w-2 rounded-full bg-[#1d5a8f]" />}</td>
                          <td className="px-2 py-2 truncate max-w-[120px]">{e.from}</td>
                          <td className="px-2 py-2 truncate">{e.subject}</td>
                          <td className="px-2 py-2 text-right text-slate-500">{e.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="border-t border-[#d0dde8] bg-[#f4f8fc] px-3 py-1 text-[10px] text-slate-400">
                {currentEmails.length} message{currentEmails.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* IE7 status bar */}
      <div className="flex items-center justify-between border-t border-[#8ca8c4] bg-[linear-gradient(180deg,#e8f0f8_0%,#ccdce8_100%)] px-3 py-0.5 text-[10px] text-slate-500">
        <span>Done</span>
        <div className="flex items-center gap-2">
          <span>Internet</span>
          <span className="h-3 border-l border-slate-300" />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

// Compose pane component
function ComposePane({ firstName, lastName, email, message, setFirstName, setLastName, setEmail, setMessage, status, errorMessage, onSend, onCancel }:
  { firstName: string; lastName: string; email: string; message: string; setFirstName: (s: string) => void; setLastName: (s: string) => void; setEmail: (s: string) => void; setMessage: (s: string) => void; status: string; errorMessage?: string; onSend: () => void; onCancel: () => void }) {

  if (status === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#f0f8ff]">
        <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#4caf50" opacity="0.2"/><path d="M16 24l6 6 12-12" stroke="#4caf50" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
        <div className="mt-3 text-[14px] font-bold text-[#2e7d32]">Message Sent Successfully</div>
        <div className="mt-1 text-[11px] text-slate-500">Your message has been delivered via Windows Live Hotmail.</div>
      </div>
    );
  }

  if (status === 'limit') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#fff8f0]">
        <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#f44336" opacity="0.15"/><path d="M24 14v12M24 30v2" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round"/></svg>
        <div className="mt-3 text-[14px] font-bold text-[#c62828]">Send Limit Reached</div>
        <div className="mt-1 text-[11px] text-slate-500">Maximum 2 messages per session. Try again later.</div>
        <button type="button" onClick={onCancel} className="mt-4 rounded border border-[#7b9ec0] bg-[linear-gradient(180deg,#f8fbff_0%,#dbe8f4_100%)] px-4 py-1.5 text-[11px] font-medium text-[#1d5a8f]">Back to Inbox</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#fff8f0]">
        <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#f44336" opacity="0.15"/><path d="M24 14v12M24 30v2" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round"/></svg>
        <div className="mt-3 text-[14px] font-bold text-[#c62828]">Failed to Send</div>
        <div className="mt-1 px-8 text-center text-[11px] text-slate-500 max-w-sm">{errorMessage || 'An unknown error occurred.'}</div>
        <button type="button" onClick={onCancel} className="mt-4 rounded border border-[#7b9ec0] bg-[linear-gradient(180deg,#f8fbff_0%,#dbe8f4_100%)] px-4 py-1.5 text-[11px] font-medium text-[#1d5a8f]">Back to Inbox</button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#d0dde8] bg-[#f4f8fc] px-3 py-2">
        <div className="text-[12px] font-bold text-[#1d5a8f]">New Message</div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <label className="w-14 text-right text-[11px] font-bold text-slate-500">To:</label>
          <input value="irie@irievoss.com" readOnly className="flex-1 rounded-[3px] border border-[#b0c8dc] bg-[#f0f6fc] px-2 py-1 text-[11px] text-slate-500" />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-14 text-right text-[11px] font-bold text-slate-500">Subject:</label>
          <input value={`Contact from ${firstName || 'Visitor'} ${lastName || ''}`} readOnly className="flex-1 rounded-[3px] border border-[#b0c8dc] bg-[#f0f6fc] px-2 py-1 text-[11px] text-slate-500" />
        </div>
        <div className="mx-1 border-b border-[#d0dde8]" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5 ml-1">Your First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} required
              className="w-full rounded-[3px] border border-[#b0c8dc] bg-white px-2 py-1 text-[11px] outline-none focus:border-[#1d5a8f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5 ml-1">Your Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} required
              className="w-full rounded-[3px] border border-[#b0c8dc] bg-white px-2 py-1 text-[11px] outline-none focus:border-[#1d5a8f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-0.5 ml-1">Your Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
            className="w-full rounded-[3px] border border-[#b0c8dc] bg-white px-2 py-1 text-[11px] outline-none focus:border-[#1d5a8f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
        </div>
        <div className="flex flex-col flex-1">
          <label className="block text-[10px] font-bold text-slate-500 mb-0.5 ml-1">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required
            className="w-full min-h-[120px] flex-1 rounded-[3px] border border-[#b0c8dc] bg-white px-2 py-1.5 text-[11px] outline-none resize-none focus:border-[#1d5a8f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
        </div>
      </div>
      <div className="border-t border-[#d0dde8] bg-[#f4f8fc] px-3 py-2 flex gap-2">
        <button type="button" onClick={onSend} disabled={status === 'sending'}
          className="flex items-center gap-1.5 rounded-[3px] border border-[#7b9ec0] bg-[linear-gradient(180deg,#f8fbff_0%,#dbe8f4_100%)] px-4 py-1.5 text-[11px] font-bold text-[#1d5a8f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105 disabled:opacity-50">
          {status === 'sending' ? 'Sending...' : 'Send'}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-[3px] border border-[#b0c0d0] bg-[linear-gradient(180deg,#f8f8f8_0%,#e0e4e8_100%)] px-4 py-1.5 text-[11px] text-slate-600 hover:brightness-105">
          Cancel
        </button>
      </div>
    </div>
  );
}

// Small IE toolbar button
function IEToolBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button type="button" title={title}
      className="flex h-6 w-6 items-center justify-center rounded-[2px] text-[#3a5a7a] hover:bg-[rgba(255,255,255,0.5)] active:bg-[rgba(0,0,0,0.1)]">
      {children}
    </button>
  );
}

// Folder icon SVGs
function FolderSVG({ type }: { type: string }) {
  if (type === 'inbox') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h4l1-1h7v10H2z" fill="#f0c040" stroke="#b08020" strokeWidth="0.8"/><path d="M2 7h12v6H2z" fill="#fde68a" opacity="0.6"/></svg>;
  if (type === 'sent') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4l5 4 5-4v9H3z" fill="#7cb8e8" stroke="#4080b0" strokeWidth="0.8"/></svg>;
  if (type === 'junk') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" fill="#ff9800" opacity="0.3" stroke="#e65100" strokeWidth="0.8"/><path d="M6 6l4 4M10 6l-4 4" stroke="#e65100" strokeWidth="1.2"/></svg>;
  if (type === 'drafts') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2h6l3 3v9H4z" fill="#e0e8f0" stroke="#8090a0" strokeWidth="0.8"/><path d="M10 2v3h3" stroke="#8090a0" strokeWidth="0.8"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v10H3z" fill="#e0e0e0" stroke="#909090" strokeWidth="0.8"/><path d="M5 6l6 0M5 9l4 0" stroke="#909090" strokeWidth="0.8"/></svg>;
}