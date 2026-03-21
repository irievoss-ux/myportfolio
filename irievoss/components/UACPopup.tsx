"use client";

interface UACProps {
  appName: string;
  onContinue: () => void;
  onCancel: () => void;
}

export default function UACPopup({ appName, onContinue, onCancel }: UACProps) {
  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      {/* THE DIALOG BOX */}
      <div className="w-[450px] bg-[#f0f0f0] border border-gray-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-md overflow-hidden font-sans">
        
        {/* Blue Header */}
        <div className="bg-[#005a9e] p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xl">🛡️</div>
          <span className="text-white text-sm font-semibold">User Account Control</span>
        </div>

        {/* Body Content */}
        <div className="p-6 bg-white flex gap-4">
          <div className="text-4xl">🛡️</div>
          <div className="flex flex-col gap-3">
            <h2 className="text-blue-900 font-bold text-lg leading-tight">
              Windows needs your permission to continue
            </h2>
            <p className="text-xs text-gray-600">
              If you started this action, continue.
            </p>
            
            <div className="mt-2 p-3 border border-gray-200 bg-gray-50 rounded flex flex-col">
              <span className="text-[10px] uppercase text-gray-500 font-bold">Program Name</span>
              <span className="text-sm font-bold text-gray-800">{appName}</span>
              <span className="text-[10px] uppercase text-gray-500 font-bold mt-2">Verified Publisher</span>
              <span className="text-sm text-gray-800">Irie Voss Ultimate Edition</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-[#f0f0f0] p-4 flex justify-end gap-2 border-t border-gray-300">
          <button 
            onClick={onContinue}
            className="px-8 py-1.5 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 active:shadow-inner rounded-sm text-xs font-bold text-gray-800 shadow-sm"
          >
            Continue
          </button>
          <button 
            onClick={onCancel}
            className="px-8 py-1.5 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 active:shadow-inner rounded-sm text-xs text-gray-800 shadow-sm"
          >
            Cancel
          </button>
        </div>

        {/* Details arrow */}
        <div className="px-4 pb-2 bg-[#f0f0f0] text-[10px] text-blue-700 hover:underline cursor-pointer flex items-center gap-1">
          <span>▶</span> Details
        </div>
      </div>
    </div>
  );
}