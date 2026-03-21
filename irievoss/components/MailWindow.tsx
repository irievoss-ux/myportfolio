"use client";
import { useState } from 'react';
import { sendEmail } from '@/app/actions';

export default function MailWindow() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'limit'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    const result = await sendEmail(payload);

    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000); 
    } else if (result.error === "RATE_LIMIT") {
      setStatus('limit');
    } else {
      alert("System Error: Failed to connect to mail server.");
      setStatus('idle');
    }
  }

  // AERO ANTI-SPAM SCREEN
  if (status === 'limit') {
    return (
      <div className="bg-gradient-to-b from-white to-blue-50 p-6 font-sans text-sm h-full flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4 drop-shadow-md">🛑</div>
        <h2 className="font-bold text-red-600 text-xl mb-2 drop-shadow-sm">Action Blocked</h2>
        <p className="text-gray-700 font-medium">Anti-Spam Protocol Active.</p>
        <p className="text-gray-500 text-xs mt-2">Maximum 2 transmissions per user reached.<br/>Try again tomorrow.</p>
      </div>
    );
  }

  // AERO SUCCESS SCREEN
  if (status === 'success') {
    return (
      <div className="bg-gradient-to-b from-white to-green-50 p-6 font-sans text-sm h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-200">
          <span className="text-5xl drop-shadow-md">🌿</span>
        </div>
        <p className="font-bold text-lg text-green-700 drop-shadow-sm">Message Delivered</p>
        <p className="text-gray-500 text-xs mt-2">Your email has been securely routed.</p>
      </div>
    );
  }

  // AERO DEFAULT FORM
  return (
    <div className="bg-gradient-to-b from-white to-[#e8f4f8] p-6 font-sans text-sm h-full flex flex-col relative">
      {/* Glossy Header Highlight */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
      
      <h2 className="font-semibold text-blue-800 text-lg mb-4 flex items-center gap-2 drop-shadow-sm shrink-0 z-10">
        <span className="text-2xl drop-shadow-md">✉️</span> Windows Mail
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden z-10">
        <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">First Name</label>
              <input name="firstName" required className="w-full border border-gray-300 rounded-md shadow-inner bg-white/80 p-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">Last Name</label>
              <input name="lastName" required className="w-full border border-gray-300 rounded-md shadow-inner bg-white/80 p-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">Email Address</label>
            <input name="email" type="email" required className="w-full border border-gray-300 rounded-md shadow-inner bg-white/80 p-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800" />
          </div>
          <div className="flex flex-col h-32">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">Message</label>
            <textarea name="message" required className="w-full flex-1 border border-gray-300 rounded-md shadow-inner bg-white/80 p-2 outline-none resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800" />
          </div>
        </div>

        <div className="shrink-0 pt-4 mt-2 border-t border-gray-300/50 flex flex-col gap-3">
          <div className="flex justify-end gap-3">
            <button type="reset" className="px-6 py-2 rounded-full border border-gray-300 bg-gradient-to-b from-white to-gray-100 hover:to-gray-200 text-gray-700 font-medium shadow-sm transition-all text-xs">
               Clear
            </button>
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="px-8 py-2 rounded-full border border-blue-600 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold shadow-[0_2px_5px_rgba(37,99,235,0.4)] disabled:opacity-70 transition-all flex items-center gap-2 text-xs"
            >
               {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}