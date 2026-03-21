"use client";
import { useState, useEffect } from 'react';

export default function TaskManager({ windows, onEndTask }: any) {
  const [activeTab, setActiveTab] = useState('Applications');
  const [cpuLoad, setCpuLoad] = useState<number[]>(Array(30).fill(0));

  // Simulate CPU Heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => {
        const newLoad = Math.floor(Math.random() * 20) + 5; // 5-25% idle
        return [...prev.slice(1), newLoad];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApps = Object.entries(windows)
    .filter(([_, win]: any) => win.isOpen)
    .map(([id, _]) => id);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] font-sans text-[11px] select-none text-black">
      {/* Menu Bar */}
      <div className="flex gap-3 px-2 py-1 border-b border-gray-300">
        <span className="hover:bg-blue-100 px-1">File</span>
        <span className="hover:bg-blue-100 px-1">Options</span>
        <span className="hover:bg-blue-100 px-1">View</span>
        <span className="hover:bg-blue-100 px-1">Help</span>
      </div>

      {/* Tabs */}
      <div className="flex px-1 pt-1 gap-[2px] bg-white border-b border-gray-300">
        {['Applications', 'Processes', 'Services', 'Performance'].map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 border-t border-l border-r rounded-t-md cursor-default ${activeTab === tab ? 'bg-[#f0f0f0] border-gray-400 z-10 translate-y-[1px]' : 'bg-[#e0e0e0] border-transparent hover:bg-white'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex-1 p-3 flex flex-col overflow-hidden bg-[#f0f0f0]">
        
        {/* APPLICATIONS TAB */}
        {activeTab === 'Applications' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-white border border-gray-400 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f0f0f0] border-b border-gray-300 sticky top-0">
                  <tr>
                    <th className="font-normal px-2 py-1 border-r border-gray-300">Task</th>
                    <th className="font-normal px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openApps.map(app => (
                    <tr key={app} className="hover:bg-blue-600 hover:text-white group">
                      <td className="px-2 py-0.5 border-r border-gray-200 capitalize">{app}</td>
                      <td className="px-2 py-0.5">Running</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={() => openApps[0] && onEndTask(openApps[openApps.length-1])}
                className="px-6 py-1 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 active:shadow-inner rounded-sm shadow-sm"
              >
                End Task
              </button>
              <button className="px-6 py-1 border border-gray-400 bg-gradient-to-b from-white to-gray-200 rounded-sm shadow-sm">New Task...</button>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'Performance' && (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-gray-600">CPU Usage History</div>
              <div className="flex-1 bg-black border border-green-900 relative p-1">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20">
                  {Array(24).fill(0).map((_, i) => <div key={i} className="border border-green-500" />)}
                </div>
                {/* Green Graph */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full relative z-10">
                  <polyline
                    fill="none"
                    stroke="#00ff00"
                    strokeWidth="1"
                    points={cpuLoad.map((val, i) => `${(i / 29) * 100},${100 - val}`).join(' ')}
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="bg-white border border-gray-400 p-2 h-20">
                  <div className="text-[9px] text-gray-500 uppercase">Physical Memory Usage</div>
                  <div className="text-xl font-light text-blue-800">1.24 GB</div>
               </div>
               <div className="text-[10px] space-y-1">
                  <div className="flex justify-between border-b border-gray-200"><span>Handles:</span> <span>18432</span></div>
                  <div className="flex justify-between border-b border-gray-200"><span>Threads:</span> <span>642</span></div>
                  <div className="flex justify-between border-b border-gray-200"><span>Processes:</span> <span>48</span></div>
               </div>
            </div>
          </div>
        )}

        {activeTab !== 'Applications' && activeTab !== 'Performance' && (
           <div className="flex items-center justify-center h-full text-gray-400 italic">
             This tab is restricted by the Administrator.
           </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="h-6 bg-[#f0f0f0] border-t border-white px-3 flex items-center justify-between text-[10px] text-gray-600">
        <div>Processes: 48</div>
        <div>CPU Usage: {cpuLoad[29]}%</div>
        <div>Physical Memory: 31%</div>
      </div>
    </div>
  );
}