// src/app/play/page.tsx
"use client";

import { useState, useEffect } from "react";
import usePartySocket from "partysocket/react";
import OverworldCanvas from "@/components/OverworldCanvas";
import BattleArena from "@/components/BattleArena";
import { saveProgress } from "@/app/actions/game"; // NEW: Import save action

export default function GameClient() {
  // 1. All State Hooks first
  const [logs, setLogs] = useState<string[]>(["Leaf-UI Active. Welcome, Seed-Singer."]);
  const [gameState, setGameState] = useState<'EXPLORING' | 'BATTLING'>('EXPLORING'); 
  const [playerHp, setPlayerHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [bioMass, setBioMass] = useState(0); 
  const [myceliumLevel, setMyceliumLevel] = useState(1);
  const [inventory, setInventory] = useState<{ itemName: string; quantity: number }[]>([
    { itemName: "Data-Seed", quantity: 5 }
  ]);
  const [roster, setRoster] = useState<{ name: string; level: number }[]>([]);
  
  const xpNeeded = myceliumLevel * 100;
  const roomName = "Overgrown_Outpost";

  // 2. Helper functions
  const addLog = (msg: string) => setLogs((prev) => [...prev, msg].slice(-5)); 

  const handleSync = async () => {
    const result = await saveProgress({
      bioMass,
      myceliumLevel,
      inventory,
      playerHp,
      maxHp
    });
    
    if (result.success) {
      console.log("Auto-save successful");
    } else {
      addLog("Sync Error: Data not anchored.");
    }
  };

  // 3. Effects that use those states/functions
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (gameState === 'EXPLORING') {
        handleSync();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [playerHp, bioMass, inventory, gameState]);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomName,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'PLAYER_JOINED') addLog(`Network: Seed-Singer joined (${data.id.slice(0,4)})`);
    },
  }); 

  
  const handlePlayerMoveOnGrid = (newPos: { x: number; y: number }) => {
    socket.send(JSON.stringify({ type: 'MOVE', position: newPos, zone: roomName }));
  };

  const handleEncounter = () => {
    addLog("WARNING: WILD SPROUT DETECTED!");
    setGameState('BATTLING');
  };

  // --- XP & LEVELING LOGIC ---
  const gainBioMass = (amount: number) => {
    const newTotal = bioMass + amount;
    if (newTotal >= xpNeeded) {
      setMyceliumLevel(prev => prev + 1);
      setBioMass(newTotal - xpNeeded);
      setMaxHp(prev => prev + 25);
      setPlayerHp(prev => prev + 25); 
      addLog(`*** LEVEL UP! Reached Mycelium Level ${myceliumLevel + 1}! ***`);
    } else {
      setBioMass(newTotal);
    }
  };

  const handleVictory = (lootName: string, xpGained: number) => {
    setInventory((prev) => {
      const existing = prev.find(item => item.itemName === lootName);
      if (existing) return prev.map(item => item.itemName === lootName ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { itemName: lootName, quantity: 1 }];
    });
    gainBioMass(xpGained);
    setGameState('EXPLORING');
  };

  const handleCapture = (sproutName: string, xpGained: number) => {
    addLog(`Success! ${sproutName} added to Roster.`);
    setRoster(prev => [...prev, { name: sproutName, level: 1 }]);
    gainBioMass(xpGained);
    setGameState('EXPLORING');
  };

  // --- DEATH PENALTY ---
  const handleDeath = () => {
    const loss = 50;
    setBioMass(prev => Math.max(0, prev - loss)); 
    setPlayerHp(maxHp); 
    addLog(`CRITICAL FAILURE. Lost ${loss} Bio-Mass. Revived at Save Point.`);
    setGameState('EXPLORING');
  };

  // --- RECYCLE SPROUT TO HEAL ---
  const recycleSprout = (indexToRemove: number) => {
    if (playerHp >= maxHp) {
      addLog("Health is already full.");
      return;
    }
    const sproutToSacrifice = roster[indexToRemove];
    setRoster(prev => prev.filter((_, idx) => idx !== indexToRemove));
    
    const healAmount = 50;
    setPlayerHp(prev => Math.min(maxHp, prev + healAmount));
    addLog(`Recycled ${sproutToSacrifice.name}. Recovered ${healAmount} HP.`);
  };

  const handleConsumeItem = (itemName: string) => {
    setInventory(prev => prev.map(item => 
      item.itemName === itemName ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    ).filter(item => item.quantity > 0)); 
  };

  return (
    <main className="min-h-screen bg-black text-emerald-400 p-6 font-mono selection:bg-emerald-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b-4 border-emerald-900 pb-4 bg-neutral-950 p-4 shadow-[4px_4px_0_rgba(2,44,34,1)]">
        <div>
           <h1 className="text-2xl font-black text-emerald-300 uppercase tracking-widest">[ SeedSingers ]</h1>
           <div className="mt-2 text-xs flex gap-4 text-emerald-500">
              <span className="bg-emerald-950 px-2 py-1 border border-emerald-900">Lv: {myceliumLevel}</span>
              <span className="bg-emerald-950 px-2 py-1 border border-emerald-900 font-bold">
                HP: <span className={playerHp < 30 ? 'text-red-400 animate-pulse' : 'text-emerald-300'}>{playerHp}/{maxHp}</span>
              </span>
              <span className="bg-emerald-950 px-2 py-1 border border-emerald-900">XP: {bioMass}/{xpNeeded}</span>
           </div>
        </div>
        <div className="flex gap-6 text-sm text-emerald-600">
          <span>ZONE: <span className="text-emerald-400">{roomName}</span></span>
          <span>STATUS: <span className={`font-bold ${gameState === 'BATTLING' ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {gameState === 'BATTLING' ? 'COMBAT ENGAGED' : 'ONLINE'}
          </span></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr,auto] gap-8">
        
        <div className="flex justify-center items-start w-full">
          {gameState === 'EXPLORING' ? (
            <OverworldCanvas onMove={handlePlayerMoveOnGrid} onEncounter={handleEncounter} />
          ) : (
            <BattleArena 
              inventory={inventory}
              playerHp={playerHp}
              maxHp={maxHp}
              setPlayerHp={setPlayerHp}
              onFlee={() => { addLog("Escaped safely."); setGameState('EXPLORING'); }} 
              onVictory={handleVictory} 
              onCapture={handleCapture}
              onConsumeItem={handleConsumeItem}
              onDeath={handleDeath}
            />
          )}
        </div>

        {/* SIDE PANEL */}
        <div className="xl:w-80 flex flex-col gap-6">
          
          {/* Sprout Roster Box */}
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-cyan-300 mb-3 border-b-2 border-emerald-900 pb-1">Sprout Roster</h2>
            <div className="text-sm text-emerald-500 min-h-[60px]">
              {roster.length === 0 ? (
                 <span className="text-emerald-700 italic">No Sprouts synced yet...</span>
              ) : (
                 <ul className="space-y-2">
                   {roster.map((sprout, idx) => (
                     <li key={idx} className="flex justify-between items-center bg-black p-2 border border-cyan-900 text-cyan-400">
                       <div className="flex flex-col">
                         <span>{sprout.name}</span>
                         <span className="text-[10px] text-cyan-600 font-bold">Lv.{sprout.level}</span>
                       </div>
                       <button 
                         onClick={() => recycleSprout(idx)}
                         className="bg-emerald-900/50 hover:bg-emerald-700 text-emerald-300 text-[10px] px-2 py-1 border border-emerald-700 transition-colors"
                         title="Sacrifice this Sprout to restore 50 HP"
                       >
                         Recycle (+HP)
                       </button>
                     </li>
                   ))}
                 </ul>
              )}
            </div>
          </div>

          {/* Inventory Box */}
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-emerald-300 mb-3 border-b-2 border-emerald-900 pb-1">Inventory</h2>
            <div className="text-sm text-emerald-500 min-h-[100px]">
              {inventory.length === 0 ? (
                 <span className="text-emerald-700 italic">Storage is empty...</span>
              ) : (
                 <ul className="space-y-2">
                   {inventory.map((item, idx) => (
                     <li key={idx} className="flex justify-between bg-black p-2 border border-emerald-900">
                       <span className={item.itemName === 'Data-Seed' ? 'text-cyan-300' : ''}>{item.itemName}</span>
                       <span className="text-emerald-300 font-bold">x{item.quantity}</span>
                     </li>
                   ))}
                 </ul>
              )}
            </div>
          </div>
          
          {/* System Logs */}
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-emerald-300 mb-3 border-b-2 border-emerald-900 pb-1 flex justify-between items-center">
              <span>System Logs</span>
              <button 
                onClick={handleSync}
                className="text-[10px] bg-neutral-900 border border-emerald-800 px-2 py-1 hover:bg-emerald-950 text-emerald-500 transition-all active:scale-95"
              >
                [ Sync to DB ]
              </button>
            </h2>
            <div className="text-[11px] text-emerald-500 space-y-2 h-32 overflow-y-auto flex flex-col justify-end">
              {logs.map((log, i) => (
                <div key={i} className={`leading-relaxed ${log.includes('CRITICAL') || log.includes('WARNING') ? 'text-red-400 font-bold' : ''} ${log.includes('LEVEL UP') ? 'text-yellow-400 font-bold' : ''}`}>
                  {">"} {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}