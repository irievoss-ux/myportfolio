"use client";

interface Props {
  onCancel: () => void;
  onShutDown: () => void;
}

export default function ShutdownDialog({ onCancel, onShutDown }: Props) {
  return (
    <div className="fixed inset-0 z-[300000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="w-[400px] bg-[#f0f0f0] border border-gray-500 shadow-2xl rounded-md overflow-hidden font-sans select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003399] to-[#6699ff] p-2 flex items-center gap-2">
           <span className="text-white text-sm font-semibold ml-1">Shut Down Windows</span>
        </div>

        <div className="p-6 bg-white flex gap-6">
          <div className="text-5xl">💻</div>
          <div className="flex flex-col gap-4 w-full">
            <p className="text-xs text-gray-700 font-medium">What do you want the computer to do?</p>
            
            <select className="w-full p-1 border border-gray-400 text-xs outline-none bg-white">
              <option>Shut down</option>
              <option>Restart</option>
              <option>Sleep</option>
              <option>Switch user</option>
            </select>

            <p className="text-[10px] text-gray-500 italic">
              Ends your session and turns off the computer.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-[#f0f0f0] p-3 flex justify-end gap-2 border-t border-gray-300">
          <button 
            onClick={onShutDown}
            className="px-6 py-1 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 rounded-sm text-xs shadow-sm"
          >
            OK
          </button>
          <button 
            onClick={onCancel}
            className="px-6 py-1 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 rounded-sm text-xs shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}