"use client";

interface PersonalizeProps {
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  aeroColor: string;
  setAeroColor: (color: string) => void;
}

export default function Personalize({ currentWallpaper, setWallpaper, aeroColor, setAeroColor }: PersonalizeProps) {
  const wallpapers = [
    { id: 'aurora', label: 'Windows Aurora', colors: 'from-[#093c60] via-[#157b97] to-[#b8e28a]' },
    { id: 'grass', label: 'Meadow', colors: 'from-[#4facfe] to-[#00f2fe] via-[#80D670] to-[#80D670]' },
    { id: 'floral', label: 'Flowers', colors: 'from-[#ff9a9e] via-[#fecfef] to-[#feada6]' },
    { id: 'dark', label: 'Graphite', colors: 'from-[#232526] to-[#414345]' },
  ];

  const colors = [
    { id: 'teal', bg: 'bg-[#157b97]' },
    { id: 'graphite', bg: 'bg-[#222222]' },
    { id: 'ruby', bg: 'bg-[#9b1c1c]' },
    { id: 'emerald', bg: 'bg-[#065f46]' },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f0f0f0] p-6 font-sans text-sm">
      <h2 className="mb-6 text-xl font-light text-blue-900">Personalization</h2>

      <section className="mb-8">
        <h3 className="mb-3 border-b pb-1 font-bold text-gray-700">Window Color and Appearance</h3>
        <p className="mb-4 text-xs text-gray-500">Choose a color for your window borders and taskbar.</p>
        <div className="flex gap-4">
          {colors.map((color) => (
            <button key={color.id} type="button" onClick={() => setAeroColor(color.id)} className={`h-12 w-12 rounded border-2 transition-all ${color.bg} ${aeroColor === color.id ? 'scale-110 border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-400'}`} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 border-b pb-1 font-bold text-gray-700">Desktop Background</h3>
        <p className="mb-4 text-xs text-gray-500">Select a background for your desktop.</p>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper) => (
            <button key={wallpaper.id} type="button" onClick={() => setWallpaper(wallpaper.id)} className={`flex flex-col gap-2 rounded border p-2 text-left transition-all bg-white shadow-sm ${currentWallpaper === wallpaper.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className={`h-20 w-full rounded bg-gradient-to-br ${wallpaper.colors}`} />
              <span className="text-center text-[10px] font-medium">{wallpaper.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
