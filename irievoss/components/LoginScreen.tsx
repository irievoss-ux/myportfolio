"use client";

// Added { userName, userImage, onLogin }
export default function LoginScreen({ userName, userImage, onLogin }: any) {
  return (
    <div className="fixed inset-0 z-[500000] bg-[#003399] flex flex-col items-center justify-center font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-900 to-black opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* User Image Frame */}
        <div className="w-32 h-32 bg-white rounded-lg border-2 border-white/50 p-1 shadow-2xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-6xl">
            {userImage}
          </div>
        </div>

        <h1 className="text-white text-2xl font-light drop-shadow-md">{userName}</h1>

        <div className="flex flex-col items-center gap-4 w-64">
          <input 
            type="password" 
            placeholder="Password"
            autoFocus
            className="w-full px-3 py-1.5 rounded-sm border border-gray-400 shadow-inner outline-none focus:ring-2 ring-blue-400/50"
            onKeyDown={(e) => e.key === 'Enter' && onLogin()}
          />
          <button 
            onClick={onLogin}
            className="w-10 h-10 rounded-full border-2 border-white/80 bg-blue-500/20 hover:bg-blue-500/40 text-white flex items-center justify-center transition-all shadow-lg"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 text-white/40 text-sm font-light italic">
        Windows Vista™ Ultimate
      </div>
    </div>
  );
}