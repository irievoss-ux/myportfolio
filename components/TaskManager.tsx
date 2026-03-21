"use client";

import { useEffect, useState } from 'react';

interface TaskWindow {
  isOpen: boolean;
  title: string;
}

interface TaskManagerProps {
  windows: Record<string, TaskWindow>;
  onEndTask: (id: string) => void;
}

export default function TaskManager({ windows, onEndTask }: TaskManagerProps) {
  const [activeTab, setActiveTab] = useState('Applications');
  const [cpuLoad, setCpuLoad] = useState<number[]>(Array(30).fill(0));
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad((prev) => [...prev.slice(1), Math.floor(Math.random() * 20) + 5]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApps = Object.entries(windows)
    .filter(([, win]) => win.isOpen)
    .map(([id, win]) => ({ id, title: win.title }));

  return (
    <div className="flex h-full flex-col select-none bg-[#f0f0f0] font-sans text-[11px] text-black">
      <div className="flex gap-3 border-b border-gray-300 px-2 py-1">
        <span className="px-1 hover:bg-blue-100">File</span>
        <span className="px-1 hover:bg-blue-100">Options</span>
        <span className="px-1 hover:bg-blue-100">View</span>
        <span className="px-1 hover:bg-blue-100">Help</span>
      </div>

      <div className="flex gap-[2px] border-b border-gray-300 bg-white px-1 pt-1">
        {['Applications', 'Processes', 'Services', 'Performance'].map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-t-md border-t border-l border-r px-3 py-1 ${activeTab === tab ? 'z-10 translate-y-[1px] border-gray-400 bg-[#f0f0f0]' : 'border-transparent bg-[#e0e0e0] hover:bg-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-[#f0f0f0] p-3">
        {activeTab === 'Applications' && (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto border border-gray-400 bg-white">
              <table className="w-full text-left">
                <thead className="sticky top-0 border-b border-gray-300 bg-[#f0f0f0]">
                  <tr>
                    <th className="border-r border-gray-300 px-2 py-1 font-normal">Task</th>
                    <th className="px-2 py-1 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {openApps.map((app) => (
                    <tr key={app.id} onClick={() => setSelectedApp(app.id)} className={`${selectedApp === app.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>
                      <td className="border-r border-gray-200 px-2 py-0.5">{app.title}</td>
                      <td className="px-2 py-0.5">Running</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => selectedApp && onEndTask(selectedApp)} className="rounded-sm border border-gray-400 bg-gradient-to-b from-white to-gray-200 px-6 py-1 shadow-sm hover:brightness-105 active:shadow-inner">
                End Task
              </button>
              <button className="rounded-sm border border-gray-400 bg-gradient-to-b from-white to-gray-200 px-6 py-1 shadow-sm">New Task...</button>
            </div>
          </div>
        )}

        {activeTab === 'Performance' && (
          <div className="grid h-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-gray-600">CPU Usage History</div>
              <div className="relative flex-1 border border-green-900 bg-black p-1">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20">
                  {Array.from({ length: 24 }).map((_, index) => <div key={index} className="border border-green-500" />)}
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="relative z-10 h-full w-full">
                  <polyline fill="none" stroke="#00ff00" strokeWidth="1" points={cpuLoad.map((val, index) => `${(index / 29) * 100},${100 - val}`).join(' ')} />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-20 border border-gray-400 bg-white p-2">
                <div className="text-[9px] uppercase text-gray-500">Physical Memory Usage</div>
                <div className="text-xl font-light text-blue-800">1.24 GB</div>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between border-b border-gray-200"><span>Handles:</span> <span>18432</span></div>
                <div className="flex justify-between border-b border-gray-200"><span>Threads:</span> <span>642</span></div>
                <div className="flex justify-between border-b border-gray-200"><span>Processes:</span> <span>{openApps.length}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Applications' && activeTab !== 'Performance' && (
          <div className="flex h-full items-center justify-center italic text-gray-400">This tab is restricted by the Administrator.</div>
        )}
      </div>

      <div className="flex h-6 items-center justify-between border-t border-white bg-[#f0f0f0] px-3 text-[10px] text-gray-600">
        <div>Processes: {openApps.length}</div>
        <div>CPU Usage: {cpuLoad[cpuLoad.length - 1]}%</div>
        <div>Physical Memory: 31%</div>
      </div>
    </div>
  );
}
