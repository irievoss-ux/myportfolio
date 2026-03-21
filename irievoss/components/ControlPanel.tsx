"use client";
import { useState } from 'react';

export default function ControlPanel({ userName, setUserName, userImage, setUserImage }: any) {
  const [view, setView] = useState('home');

  const categories = [
    { id: 'system', name: "System and Maintenance", desc: "Get started with Windows, back up your computer.", icon: "🛡️" },
    { id: 'users', name: "User Accounts", desc: "Change user photo and passwords.", icon: "👤", action: () => setView('users') },
    { id: 'network', name: "Network and Internet", desc: "View network status and tasks.", icon: "🌐" },
    { id: 'appearance', name: "Appearance and Personalization", desc: "Change desktop background and glass colors.", icon: "🎨" },
    { id: 'hardware', name: "Hardware and Sound", desc: "Adjust volume and mouse settings.", icon: "🔊" },
  ];

  const userImages = ["🌸", "🔥", "🎮", "🐱", "🌌", "💎", "⚡"];

  return (
    <div className="flex flex-col h-full bg-white font-sans text-sm select-none">
      {/* HEADER */}
      <div className="bg-[#EBF3F9] p-4 border-b border-[#A2C6E0] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-light text-blue-900">
            {view === 'home' ? 'Control Panel Home' : 'User Accounts'}
          </h1>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
            <span onClick={() => setView('home')} className="hover:underline cursor-pointer">Control Panel</span>
            {view !== 'home' && <span> ▶ User Accounts</span>}
          </div>
        </div>
        <div className="w-48 bg-white border border-gray-400 rounded px-2 py-0.5 italic text-gray-400 text-xs">
          Search Control Panel
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR TASKS */}
        <div className="w-48 bg-[#F1F8FF] border-r border-[#A2C6E0] p-4 flex flex-col gap-4 text-[11px] text-blue-800 shrink-0">
          <div className="font-bold text-gray-700 mb-[-10px]">Tasks</div>
          <div className="hover:underline cursor-pointer">Classic View</div>
          <div className="hover:underline cursor-pointer">Windows Update</div>
        </div>

        {/* MAIN VIEW */}
        <div className="flex-1 p-8 overflow-y-auto">
          {view === 'home' ? (
            <div className="grid grid-cols-1 gap-8">
              {categories.map(cat => (
                <div key={cat.id} onClick={cat.action} className="flex gap-4 group cursor-pointer">
                  <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <div>
                    <h3 className="font-bold text-blue-800 group-hover:underline">{cat.name}</h3>
                    <p className="text-xs text-gray-500 leading-tight">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* USER ACCOUNTS SUB-PAGE */
            <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded p-1 flex items-center justify-center text-3xl shadow-md">
                  {userImage}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Change Account Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border border-gray-400 p-1.5 rounded-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Change Your Picture</label>
                  <div className="flex flex-wrap gap-2">
                    {userImages.map(img => (
                      <button 
                        key={img}
                        onClick={() => setUserImage(img)}
                        className={`w-10 h-10 border rounded flex items-center justify-center text-xl transition-all ${userImage === img ? 'bg-blue-600 border-blue-800 scale-110 shadow-lg' : 'bg-gray-100 hover:bg-white'}`}
                      >
                        {img}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('home')}
                className="mt-4 px-6 py-1 bg-gradient-to-b from-white to-gray-200 border border-gray-400 rounded-sm hover:brightness-105 shadow-sm"
              >
                Apply Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}