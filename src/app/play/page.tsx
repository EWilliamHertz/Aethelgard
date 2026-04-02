// src/app/play/page.tsx
"use client";

import { useState } from "react";
import usePartySocket from "partysocket/react";
import OverworldCanvas from "@/components/OverworldCanvas";
import BattleArena from "@/components/BattleArena";

export default function GameClient() {
  const [logs, setLogs] = useState<string[]>(["Leaf-UI Active. Welcome, Seed-Singer."]);
  const [gameState, setGameState] = useState<'EXPLORING' | 'BATTLING'>('EXPLORING'); 
  
  // To test the capture mechanic immediately, let's start you with 5 Data-Seeds!
  const [inventory, setInventory] = useState<{ itemName: string; quantity: number }[]>([
    { itemName: "Data-Seed", quantity: 5 }
  ]);
  
  // NEW: Sprout Roster State
  const [roster, setRoster] = useState<{ name: string; level: number }[]>([]);
  
  const roomName = "Overgrown_Outpost";

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomName,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'PLAYER_JOINED') addLog(`Network: Seed-Singer joined (${data.id.slice(0,4)})`);
    },
  });

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg].slice(-4)); 

  const handlePlayerMoveOnGrid = (newPos: { x: number; y: number }) => {
    socket.send(JSON.stringify({ type: 'MOVE', position: newPos, zone: roomName }));
  };

  const handleEncounter = () => {
    addLog("WARNING: WILD SPROUT DETECTED!");
    setGameState('BATTLING');
  };

  const handleVictory = (lootName: string) => {
    addLog(`Battle Won! Acquired: ${lootName}`);
    setInventory((prev) => {
      const existing = prev.find(item => item.itemName === lootName);
      if (existing) return prev.map(item => item.itemName === lootName ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { itemName: lootName, quantity: 1 }];
    });
    setGameState('EXPLORING');
  };

  // NEW: Handle successfully capturing a Sprout
  const handleCapture = (sproutName: string) => {
    addLog(`Success! ${sproutName} added to Roster.`);
    setRoster(prev => [...prev, { name: sproutName, level: 1 }]);
    setGameState('EXPLORING');
  };

  // NEW: Handle using items from the Battle Arena
  const handleConsumeItem = (itemName: string) => {
    setInventory(prev => prev.map(item => 
      item.itemName === itemName ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    ).filter(item => item.quantity > 0)); // Remove item completely if it hits 0
  };

  return (
    <main className="min-h-screen bg-black text-emerald-400 p-6 font-mono selection:bg-emerald-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b-4 border-emerald-900 pb-4 bg-neutral-950 p-4 shadow-[4px_4px_0_rgba(2,44,34,1)]">
        <h1 className="text-2xl font-black text-emerald-300 uppercase tracking-widest">[ SeedSingers ]</h1>
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
              onFlee={() => { addLog("Escaped safely."); setGameState('EXPLORING'); }} 
              onVictory={handleVictory} 
              onCapture={handleCapture}
              onConsumeItem={handleConsumeItem}
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
                     <li key={idx} className="flex justify-between bg-black p-2 border border-cyan-900 text-cyan-400">
                       <span>{sprout.name}</span>
                       <span className="text-cyan-200 font-bold">Lv.{sprout.level}</span>
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
        </div>
      </div>
    </main>
  );
}