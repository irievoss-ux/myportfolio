"use client";

export default function Personalize({ currentWallpaper, setWallpaper, aeroColor, setAeroColor }: any) {
  const wallpapers = [
    { id: 'aurora', label: 'Windows Aurora', colors: 'from-[#093c60] via-[#157b97] to-[#b8e28a]' },
    { id: 'grass', label: 'Meadow', colors: 'from-[#4facfe] to-[#00f2fe] via-[#80D670] to-[#80D670]' },
    { id: 'floral', label: 'Flowers', colors: 'from-[#ff9a9e] via-[#fecfef] to-[#feada6]' },
    { id: 'dark', label: 'Graphite', colors: 'from-[#232526] to-[#414345]' },
  ];

  const colors = [
    { id: 'teal', bg: 'bg-[#157b97]', border: 'border-white/60' },
    { id: 'graphite', bg: 'bg-[#222222]', border: 'border-white/20' },
    { id: 'ruby', bg: 'bg-[#9b1c1c]', border: 'border-white/40' },
    { id: 'emerald', bg: 'bg-[#065f46]', border: 'border-white/40' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] font-sans text-sm p-6 overflow-y-auto">
      <h2 className="text-xl font-light text-blue-900 mb-6">Personalization</h2>
      
      {/* WINDOW COLOR SECTION */}
      <section className="mb-8">
        <h3 className="font-bold text-gray-700 mb-3 border-b pb-1">Window Color and Appearance</h3>
        <p className="text-xs text-gray-500 mb-4">Choose a color for your window borders and taskbar.</p>
        <div className="flex gap-4">
          {colors.map(c => (
            <div 
              key={c.id} 
              onClick={() => setAeroColor(c.id)}
              className={`w-12 h-12 rounded cursor-pointer border-2 transition-all ${c.bg} ${aeroColor === c.id ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent hover:border-gray-400'}`}
            />
          ))}
        </div>
      </section>

      {/* WALLPAPER SECTION */}
      <section>
        <h3 className="font-bold text-gray-700 mb-3 border-b pb-1">Desktop Background</h3>
        <p className="text-xs text-gray-500 mb-4">Select a background for your desktop.</p>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map(w => (
            <div 
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              className={`flex flex-col gap-2 p-2 border rounded cursor-pointer transition-all bg-white shadow-sm ${currentWallpaper === w.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className={`w-full h-20 rounded bg-gradient-to-br ${w.colors}`} />
              <span className="text-[10px] font-medium text-center">{w.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}