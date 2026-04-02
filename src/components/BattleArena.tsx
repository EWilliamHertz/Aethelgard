// src/components/BattleArena.tsx
'use client';

interface Props {
  onFlee: () => void;
}

export default function BattleArena({ onFlee }: Props) {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-video bg-neutral-900 border-4 border-emerald-900 relative shadow-[8px_8px_0_rgba(2,44,34,1)] overflow-hidden flex flex-col font-mono">
      
      {/* 1. CTB Timeline Placeholder (Top) */}
      <div className="h-16 bg-black border-b-4 border-emerald-900 flex items-center px-4 gap-3 overflow-hidden shadow-lg z-10">
         <span className="text-emerald-500 font-black text-sm mr-2 tracking-widest">TIMELINE:</span>
         <div className="w-8 h-8 bg-emerald-400 border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-bounce flex items-center justify-center text-black font-bold text-xs">P</div>
         <div className="w-8 h-8 bg-red-600 border-2 border-neutral-400 flex items-center justify-center text-black font-bold text-xs opacity-90">S</div>
         <div className="w-8 h-8 bg-emerald-700 border-2 border-neutral-400 flex items-center justify-center text-black font-bold text-xs opacity-50">P</div>
         <div className="w-8 h-8 bg-red-900 border-2 border-neutral-600 flex items-center justify-center text-black font-bold text-xs opacity-50">S</div>
      </div>

      {/* 2. Battle Stage (Middle) */}
      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-neutral-950">
         
         {/* Enemy: Wild Sprout (Left) */}
         <div className="absolute left-[15%] bottom-[30%] text-center">
            <div className="w-32 h-32 bg-red-950 border-4 border-red-800 animate-pulse mb-3 flex items-center justify-center text-red-500 font-bold tracking-widest shadow-[0_0_20px_rgba(153,27,27,0.5)]">
              [ SPROUT ]
            </div>
            {/* HP Bar */}
            <div className="w-full bg-black border-2 border-red-900 h-4 p-[1px]">
               <div className="bg-red-500 h-full w-full"></div>
            </div>
         </div>
         
         {/* Player: Seed-Singer (Right) */}
         <div className="absolute right-[15%] bottom-[20%] text-center">
            {/* THIS IS THE INTEGRATED SPRITE */}
            <div className="w-24 h-24 mb-3 flex items-end justify-center drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <div 
                className="w-16 h-16 transform -scale-x-100" 
                style={{
                  backgroundImage: 'url(/images/seed-singer-sprites.png)',
                  backgroundPosition: '-128px -96px', // Captures the staff-strike frame
                  imageRendering: 'pixelated',
                  backgroundSize: '320px 128px' // Dimensions of the whole sheet
                }}
              />
            </div>
            {/* HP Bar */}
            <div className="w-full bg-black border-2 border-emerald-900 h-4 p-[1px]">
               <div className="bg-emerald-400 h-full w-full"></div>
            </div>
         </div>
      </div>

      {/* 3. Action Menu (Bottom) */}
      <div className="h-44 bg-black border-t-4 border-emerald-900 grid grid-cols-2 p-4 gap-4 z-10">
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/80 border border-emerald-800/50 text-left px-4 text-emerald-300 font-bold uppercase transition-all hover:pl-6 focus:outline-none">
              Attack (Rank 1)
            </button>
            <button className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/80 border border-emerald-800/50 text-left px-4 text-emerald-300 font-bold uppercase transition-all hover:pl-6 focus:outline-none">
              Throw Data-Seed
            </button>
         </div>
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button className="flex-1 bg-neutral-900 border border-neutral-800 text-left px-4 text-emerald-700 font-bold uppercase cursor-not-allowed">
              Items (Empty)
            </button>
            <button 
              onClick={onFlee} 
              className="flex-1 bg-red-900/10 hover:bg-red-900/40 border border-red-900/30 text-left px-4 text-red-400 font-bold uppercase transition-all hover:pl-6 focus:outline-none"
            >
              Flee Encounter
            </button>
         </div>
      </div>
    </div>
  );
}