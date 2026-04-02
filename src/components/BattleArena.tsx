// src/components/BattleArena.tsx
'use client';

import { useState } from 'react';

interface Props {
  inventory: { itemName: string; quantity: number }[];
  playerHp: number; // NEW: Passed in from the main game
  maxHp: number;    // NEW: Passed in from the main game
  setPlayerHp: (hp: number) => void; // NEW: Allows the arena to update your real HP
  onFlee: () => void;
  onVictory: (lootName: string, xpGained: number) => void; // NEW: Rewards XP
  onCapture: (sproutName: string, xpGained: number) => void;
  onConsumeItem: (itemName: string) => void;
  onDeath: () => void; // NEW: Handles getting knocked out
}

const LOOT_TABLE = ["Scrap Metal", "Bio-Resin", "Data-Seed", "Solar Shard"];

export default function BattleArena({ inventory, playerHp, maxHp, setPlayerHp, onFlee, onVictory, onCapture, onConsumeItem, onDeath }: Props) {
  const [sproutHp, setSproutHp] = useState(100);
  const [battleMessage, setBattleMessage] = useState("A wild Sprout appeared!");
  const [isAttacking, setIsAttacking] = useState(false);

  const hasDataSeed = inventory.some(item => item.itemName === "Data-Seed" && item.quantity > 0);

  const handleAttack = () => {
    if (isAttacking) return;
    setIsAttacking(true);
    setBattleMessage("You strike the Sprout with your staff!");
    
    const damage = Math.floor(Math.random() * 15) + 25;
    const newSproutHp = Math.max(0, sproutHp - damage);
    setSproutHp(newSproutHp);

    if (newSproutHp === 0) {
      const droppedItem = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
      const xp = Math.floor(Math.random() * 20) + 10; // Gain 10-30 XP
      setBattleMessage(`Victory! Dropped: ${droppedItem} | +${xp} Bio-Mass`);
      setTimeout(() => onVictory(droppedItem, xp), 2500);
    } else {
      setTimeout(() => enemyTurn(), 1500);
    }
  };

  const handleCapture = () => {
    if (isAttacking || !hasDataSeed) return;
    setIsAttacking(true);
    onConsumeItem("Data-Seed");
    setBattleMessage("You threw a Data-Seed!");

    setTimeout(() => {
      const captureChance = (100 - sproutHp) / 100 + 0.10; 
      const roll = Math.random();

      if (roll < captureChance) {
        const xp = 50; // Big XP reward for capturing
        setBattleMessage("Sync Complete! +50 Bio-Mass.");
        setTimeout(() => onCapture("Moss Drone", xp), 2500);
      } else {
        setBattleMessage("Sync Failed! The Sprout rejected the code.");
        setTimeout(() => enemyTurn(), 1500);
      }
    }, 1500);
  };

  const enemyTurn = () => {
    setBattleMessage("The Sprout retaliates with a Solar Blast!");
    const enemyDamage = Math.floor(Math.random() * 10) + 10;
    const newPlayerHp = Math.max(0, playerHp - enemyDamage);
    
    setPlayerHp(newPlayerHp); // Update your real HP

    if (newPlayerHp === 0) {
      setBattleMessage("CRITICAL FAILURE. Rebooting systems...");
      setTimeout(() => onDeath(), 2500);
    } else {
      setIsAttacking(false);
    }
  };

  return (
    <div className="w-full aspect-[4/3] sm:aspect-video bg-neutral-900 border-4 border-emerald-900 relative shadow-[8px_8px_0_rgba(2,44,34,1)] flex flex-col font-mono">
      
      <div className="h-16 bg-black border-b-4 border-emerald-900 flex items-center justify-center px-4 shadow-lg z-10">
         <span className="text-emerald-300 font-bold text-sm tracking-widest text-center">
           {battleMessage}
         </span>
      </div>

      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-neutral-950">
         {/* Enemy Sprout */}
         <div className={`absolute left-[15%] bottom-[30%] text-center transition-all duration-300 ${sproutHp === 0 ? 'opacity-0 scale-50' : 'opacity-100'}`}>
            <div className="w-32 h-32 bg-red-950 border-4 border-red-800 flex items-center justify-center text-red-500 font-bold tracking-widest shadow-[0_0_20px_rgba(153,27,27,0.5)]">
              [ SPROUT ]
            </div>
            <div className="w-full bg-black border-2 border-red-900 h-4 p-[1px] mt-2">
               <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(sproutHp / 100) * 100}%` }}></div>
            </div>
         </div>
         
         {/* Player Sprite */}
         <div className="absolute right-[15%] bottom-[20%] text-center">
            <div className={`w-32 h-32 mb-2 flex items-end justify-center drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 ${playerHp === 0 ? 'opacity-0 scale-50 rotate-90' : 'opacity-100'}`}>
              <img 
                src="/images/player-sprite.png" 
                alt="Seed-Singer" 
                className={`max-h-full max-w-full object-contain transform -scale-x-100 transition-transform ${isAttacking ? '-translate-x-8 scale-110' : ''}`}
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="w-full bg-black border-2 border-emerald-900 h-4 p-[1px]">
               {/* Player HP bar now scales based on maxHp */}
               <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${(playerHp / maxHp) * 100}%` }}></div>
            </div>
            <div className="text-xs text-emerald-400 mt-1">{playerHp} / {maxHp}</div>
         </div>
      </div>

      {/* Action Menu */}
      <div className="h-44 bg-black border-t-4 border-emerald-900 grid grid-cols-2 p-4 gap-4 z-10">
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button onClick={handleAttack} disabled={isAttacking || sproutHp === 0 || playerHp === 0} className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/80 border border-emerald-800/50 text-left px-4 text-emerald-300 font-bold uppercase transition-all hover:pl-6 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              Attack (Rank 1)
            </button>
            <button 
              onClick={handleCapture} 
              disabled={isAttacking || sproutHp === 0 || playerHp === 0 || !hasDataSeed} 
              className={`flex-1 border text-left px-4 font-bold uppercase transition-all hover:pl-6 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${hasDataSeed ? 'bg-cyan-900/30 border-cyan-800/50 text-cyan-300 hover:bg-cyan-800/80' : 'bg-neutral-900 border-neutral-800 text-neutral-600'}`}
            >
              Throw Data-Seed {hasDataSeed ? '' : '(0)'}
            </button>
         </div>
         <div className="border-2 border-emerald-900 bg-neutral-950 p-2 flex flex-col gap-2">
            <button disabled className="flex-1 bg-neutral-900 border border-neutral-800 text-left px-4 text-emerald-700 font-bold uppercase cursor-not-allowed">
              Items
            </button>
            <button onClick={onFlee} disabled={isAttacking || sproutHp === 0 || playerHp === 0} className="flex-1 bg-red-900/10 hover:bg-red-900/40 border border-red-900/30 text-left px-4 text-red-400 font-bold uppercase transition-all hover:pl-6 focus:outline-none disabled:opacity-50">
              Flee Encounter
            </button>
         </div>
      </div>
    </div>
  );
}