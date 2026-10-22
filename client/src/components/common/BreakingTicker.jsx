import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function BreakingTicker({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-[#18140f] text-[#efe5d1] border-b border-[#30281b] overflow-hidden flex items-center h-10 select-none">
      {/* Breaking Badge */}
      <div className="flex items-center gap-1.5 bg-[#dc2626] text-white px-3 sm:px-4 py-2 font-bold text-xs uppercase tracking-wider z-10 shrink-0 shadow-md">
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
        <Flame className="w-3.5 h-3.5" />
        <span>Breaking</span>
      </div>

      {/* Marquee Track */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8 text-xs sm:text-sm font-medium">
          {items.map((item, index) => (
            <Link
              key={item.id || index}
              to={`/article/${item.slug}`}
              className="inline-flex items-center gap-2 hover:text-[#c79a2b] transition-colors"
            >
              <span className="text-[#c79a2b] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#352c1e]">
                {item.categoryName || item.category || 'News'}
              </span>
              <span>{item.title}</span>
              <span className="text-[#5c4f3a]">&bull;</span>
            </Link>
          ))}
          {/* Duplicate loop so seamless continuous animation */}
          {items.map((item, index) => (
            <Link
              key={`dup-${item.id || index}`}
              to={`/article/${item.slug}`}
              className="inline-flex items-center gap-2 hover:text-[#c79a2b] transition-colors"
            >
              <span className="text-[#c79a2b] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#352c1e]">
                {item.categoryName || item.category || 'News'}
              </span>
              <span>{item.title}</span>
              <span className="text-[#5c4f3a]">&bull;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
