"use client";

export default function VistaCalendar() {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = now.getDate();
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();

  return (
    <div className="w-32 h-32 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-400 rotate-[-1deg] hover:rotate-0 transition-transform cursor-default">
      {/* Orange Header */}
      <div className="bg-gradient-to-b from-[#ff8c42] to-[#ff5722] h-8 flex items-center justify-center border-b border-black/10">
        <span className="text-white text-[10px] font-bold uppercase tracking-tighter drop-shadow-sm">
          {monthName} {year}
        </span>
      </div>
      
      {/* Date Body */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">
          {dayName}
        </span>
        <span className="text-5xl font-bold text-gray-800 tracking-tighter">
          {dayNum}
        </span>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}