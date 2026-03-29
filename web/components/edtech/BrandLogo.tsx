import React from 'react';
import { BookOpen } from 'lucide-react';

export default function BrandLogo() {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      {/* Classic Book Icon: Yellow/Black */}
      <div className="relative w-9 h-9 flex items-center justify-center transition-all bg-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
        <BookOpen size={18} className="text-[#FFD60A]" strokeWidth={2.5} />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col select-none">
        <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-black">
          NEURAL<span className="text-blue-600">PATH</span>
        </h1>
        <span className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] mt-1 ml-0.5">
          
        </span>
      </div>
    </div>
  );
}
