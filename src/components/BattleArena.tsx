// src/components/BattleArena.tsx
'use client';

import { useState } from 'react';

interface Props {
  onFlee: () => void;
  onVictory: () => void; // We need a way to tell the main game we won!
}

export default function BattleArena({ onFlee, onVictory }: Props) {
  // Combat State
  const [sproutHp, setSproutHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [battleMessage, setBattleMessage] = useState("A wild Sprout appeared!");
  const [isAttacking, setIsAttacking] = useState(false); // To prevent spam-clicking

  const handleAttack = () => {
    if (isAttacking) return;
    setIsAttacking(true);
    
    setBattleMessage("You strike the Sprout with your staff!");
    
    // Calculate damage (e.g., between 25 and 40)
    const damage = Math.floor(Math.random() * 15) + 25;
    const newSproutHp = Math.max(0, sproutHp - damage);
    
    setSproutHp(newSproutHp);

    if (newSproutHp === 0) {
      setBattleMessage("The Sprout's core powers down. You win!");
      // Wait 2 seconds so the player can read the message, then exit battle
      setTimeout(() => {
        onVictory();
      }, 2000);
    } else {
      // If it survives, the Sprout attacks back!
      setTimeout(() => {
        setBattleMessage("The Sprout retaliates with a Solar Blast!");
        const enemyDamage = Math.floor(Math.random() * 10) + 10;
        setPlayerHp((prev) => Math.max(0, prev - enemyDamage));
        setIsAttacking(false);
      }, 1500);
    }
  };

  return (
    <div className="w-full aspect-[4/3] sm:aspect-video bg-neutral-900 border-4 border-emerald-900 relative shadow-[8px_8px_0_rgba(2,44,34,1)] overflow-hidden flex flex-col font-mono">
      
      {/* 1. Battle Message Log (Replaces Timeline temporarily for clarity) */}
      <div className="h-16 bg-black border-b-4 border-emerald-900 flex items-center justify-center px-4 shadow-lg z-10">
         <span className="text-emerald-300 font-bold text-sm tracking-widest text-center animate-pulse">
           {battleMessage}
         </span>
      </div>

      {/* 2. Battle Stage */}
      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-neutral-950">
         
         {/* Enemy: Wild Sprout */}
         <div className={`absolute left-[15%] bottom-[30%] text-center transition-all duration-300 ${sproutHp === 0 ? 'opacity-0 scale-50' : 'opacity-100'}`}>
            <div className="w-32 h-32 bg-red-950 border-4 border-red-800 animate-pulse mb-3 flex items-center justify-center text-red-500 font-bold tracking-widest shadow-[0_0_20px_rgba(153,27,27,0.5)]">
              [ SPROUT ]
            </div>
            {/* Dynamic HP Bar */}
            <div className="w-full bg-black border-2 border-red-900 h-4 p-[1px]">
               <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${sproutHp}%` }}></div>
            </div>
            <div className="text-xs text-red-400 mt-1">{sproutHp} / 100</div>
         </div>
         
         {/* Player: Seed-Singer */}
         <div className="absolute right-[15%] bottom-[20%] text-center">
            <div className="w-24 h-24 mb-3 flex items-end justify-center drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {/* THE FILENAME IS FIXED HERE TOO */}
              <div 
                className={`w-16 h-16 transform -scale-x-100 transition-transform ${isAttacking ? '-translate-x-8 scale-110' : ''}`} 
                style={{
                  backgroundImage: 'url(/images/seed-singers-sprites.png)', 
                  backgroundPosition: '-128px -96px',
                  imageRendering: 'pixelated',
                  backgroundSize: '320px 128px'
                }}
              />
            </div>
            {/* Dynamic HP Bar */}
            <div className="w-full bg-black border-2 border-emerald-900 h-4 p-[1px]">
               <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${playerHp}%` }}></div>
            </div>
            <div className="text-xs text-emerald-400 mt-1">{playerHp} / 100</div>
         </div>
      </div>

      {/* 3. Action Menu */}
      <div className="h-44 bg-black border-t-4 border-emerald-900 grid grid-cols-2 p-4 gap-4 z-10">
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button 
              onClick={handleAttack}
              disabled={isAttacking || sproutHp === 0}
              className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/80 border border-emerald-800/50 text-left px-4 text-emerald-300 font-bold uppercase transition-all hover:pl-6 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Attack (Rank 1)
            </button>
            <button disabled className="flex-1 bg-emerald-900/10 border border-emerald-800/30 text-left px-4 text-emerald-700 font-bold uppercase cursor-not-allowed">
              Throw Data-Seed
            </button>
         </div>
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button disabled className="flex-1 bg-neutral-900 border border-neutral-800 text-left px-4 text-emerald-700 font-bold uppercase cursor-not-allowed">
              Items (Empty)
            </button>
            <button 
              onClick={onFlee} 
              disabled={isAttacking}
              className="flex-1 bg-red-900/10 hover:bg-red-900/40 border border-red-900/30 text-left px-4 text-red-400 font-bold uppercase transition-all hover:pl-6 focus:outline-none disabled:opacity-50"
            >
              Flee Encounter
            </button>
         </div>
      </div>
    </div>
  );
}