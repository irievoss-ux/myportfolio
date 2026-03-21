"use client";

export default function SystemProperties({ userName }: any) { // Added prop here
  return (
    <div className="flex flex-col h-full bg-white font-sans text-sm select-none overflow-hidden">
      <div className="bg-gradient-to-r from-[#003399] to-[#6699ff] p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-white text-2xl font-light italic drop-shadow-md">Windows Vista™ Ultimate</h1>
          <p className="text-white/80 text-xs">Copyright © 2006 Microsoft Corporation.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-48 bg-[#f0f0f0] border-r border-gray-300 p-4 flex flex-col gap-4 text-[11px] text-blue-800">
          <div className="hover:underline cursor-pointer">Device Manager</div>
          <div className="hover:underline cursor-pointer">Advanced system settings</div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white space-y-8">
          <section>
            <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-4">System</h3>
            <div className="grid grid-cols-3 gap-y-3 text-xs">
              <div className="text-gray-500">Processor:</div>
              <div className="col-span-2 text-gray-800 font-medium">Irie Voss Quad-Core @ 4.20 GHz</div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-4">Computer name settings</h3>
            <div className="grid grid-cols-3 gap-y-3 text-xs">
              <div className="text-gray-500">Computer name:</div>
              {/* Uses your actual user name */}
              <div className="col-span-2 text-gray-800 font-medium uppercase">{userName.replace(/\s/g, '')}-PC</div>
              <div className="text-gray-500">Workgroup:</div>
              <div className="col-span-2 text-gray-800 font-medium uppercase">WORKGROUP</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}