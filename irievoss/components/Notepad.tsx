"use client";

export default function Notepad({ file }: { file: any }) {
  const content = file?.content || "File not found.";

  return (
    <div className="flex flex-col h-full bg-white font-mono text-sm select-text">
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 bg-[#f0f0f0] border-b border-gray-300 text-xs text-black">
        <span className="hover:bg-blue-100 px-1 cursor-default">File</span>
        <span className="hover:bg-blue-100 px-1 cursor-default">Edit</span>
        <span className="hover:bg-blue-100 px-1 cursor-default">Format</span>
        <span className="hover:bg-blue-100 px-1 cursor-default">View</span>
        <span className="hover:bg-blue-100 px-1 cursor-default">Help</span>
      </div>
      
      {/* Text Area */}
      <textarea 
        className="flex-1 p-2 outline-none resize-none bg-white text-black"
        defaultValue={content}
        spellCheck={false}
      />
    </div>
  );
}