"use client";
import { motion } from 'framer-motion';

interface Props {
  label: string;
  icon: string;
  x: number;
  y: number;
  onOpen: () => void;
}

export default function DesktopIcon({ label, icon, x, y, onOpen }: Props) {
  return (
    <motion.div 
      drag 
      dragMomentum={false}
      initial={{ x, y }}
      onDoubleClick={onOpen}
      className="absolute flex flex-col items-center w-20 group cursor-pointer z-10"
    >
      <div className="w-12 h-12 flex items-center justify-center text-4xl group-active:opacity-70 select-none">
        {icon}
      </div>
      <span className="mt-1 text-[10px] bg-black text-white px-1 text-center font-mono group-hover:bg-[#000080] border border-transparent group-hover:border-dotted group-hover:border-white select-none whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  );
}