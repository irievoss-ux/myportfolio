"use client";

interface SystemPropertiesProps {
  userName: string;
  onOpenWindow: (id: string) => void;
}

export default function SystemProperties({ userName, onOpenWindow }: SystemPropertiesProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white font-sans text-sm select-none">
      <div className="shrink-0 bg-gradient-to-r from-[#003399] to-[#6699ff] p-6">
        <h1 className="text-2xl font-light italic text-white drop-shadow-md">Windows Vista™ Ultimate</h1>
        <p className="text-xs text-white/80">Copyright © 2006 Microsoft Corporation.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r border-gray-300 bg-[#f0f0f0] p-4 text-[11px] text-blue-800">
          <button type="button" onClick={() => onOpenWindow('wei')} className="mb-3 block hover:underline">Performance Information and Tools</button>
          <button type="button" onClick={() => onOpenWindow('taskmanager')} className="mb-3 block hover:underline">Task Manager</button>
          <button type="button" onClick={() => onOpenWindow('controlpanel')} className="block hover:underline">Control Panel Home</button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto bg-white p-6">
          <section>
            <h3 className="mb-4 border-b border-blue-200 pb-1 font-bold text-blue-900">System</h3>
            <div className="grid grid-cols-3 gap-y-3 text-xs">
              <div className="text-gray-500">Edition:</div>
              <div className="col-span-2 font-medium text-gray-800">Windows Vista™ Ultimate Portfolio Edition</div>
              <div className="text-gray-500">Processor:</div>
              <div className="col-span-2 font-medium text-gray-800">Irie Voss Quad-Core @ 4.20 GHz</div>
              <div className="text-gray-500">Memory (RAM):</div>
              <div className="col-span-2 font-medium text-gray-800">4.00 GB</div>
              <div className="text-gray-500">System type:</div>
              <div className="col-span-2 font-medium text-gray-800">64-bit Operating System</div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 border-b border-blue-200 pb-1 font-bold text-blue-900">Computer name settings</h3>
            <div className="grid grid-cols-3 gap-y-3 text-xs">
              <div className="text-gray-500">Computer name:</div>
              <div className="col-span-2 font-medium uppercase text-gray-800">{userName.replace(/\s/g, '')}-PC</div>
              <div className="text-gray-500">Workgroup:</div>
              <div className="col-span-2 font-medium uppercase text-gray-800">WORKGROUP</div>
            </div>
          </section>

          <section className="rounded-[12px] border border-blue-100 bg-blue-50 p-4 text-xs text-blue-900">
            <div className="font-semibold">Windows Experience Index</div>
            <p className="mt-2 text-blue-800/80">This machine is tuned for streaming, creative tooling, and a suspicious amount of Vista chrome.</p>
            <button type="button" onClick={() => onOpenWindow('wei')} className="mt-3 rounded border border-blue-300 bg-white px-3 py-1 text-[11px] shadow-sm">
              View base score
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
