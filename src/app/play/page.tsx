// src/app/play/page.tsx
"use client";

import { useState } from "react";
import usePartySocket from "partysocket/react";
import OverworldCanvas from "@/components/OverworldCanvas";
import BattleArena from "@/components/BattleArena"; // NEW: Import the arena

export default function GameClient() {
  const [logs, setLogs] = useState<string[]>(["Leaf-UI Active. Welcome, Seed-Singer."]);
  // NEW: State to track if we are exploring or fighting
  const [gameState, setGameState] = useState<'EXPLORING' | 'BATTLING'>('EXPLORING'); 
  const roomName = "Overgrown_Outpost";

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomName,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'PLAYER_JOINED') addLog(`Network: Seed-Singer joined (${data.id.slice(0,4)})`);
      if (data.type === 'PLAYER_LEFT') addLog(`Network: Seed-Singer left (${data.id.slice(0,4)})`);
    },
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg].slice(-4)); 
  };

  const handlePlayerMoveOnGrid = (newPos: { x: number; y: number }) => {
    socket.send(JSON.stringify({ type: 'MOVE', position: newPos, zone: roomName }));
  };

  // NEW: Function triggered by the Canvas 10% chance
  const handleEncounter = () => {
    addLog("WARNING: WILD SPROUT DETECTED! Commencing Sync Protocol...");
    setGameState('BATTLING');
  };

  // NEW: Function triggered by the "Flee" button in the Arena
  const handleFlee = () => {
    addLog("Escaped the encounter safely.");
    setGameState('EXPLORING');
  };

  return (
    <main className="min-h-screen bg-black text-emerald-400 p-6 font-mono selection:bg-emerald-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b-4 border-emerald-900 pb-4 bg-neutral-950 p-4 shadow-[4px_4px_0_rgba(2,44,34,1)]">
        <h1 className="text-2xl font-black text-emerald-300 uppercase tracking-widest">[ SeedSingers ]</h1>
        <div className="flex gap-6 text-sm text-emerald-600">
          <span>ZONE: <span className="text-emerald-400">{roomName}</span></span>
          {/* Conditional UI Header */}
          <span>STATUS: <span className={`font-bold ${gameState === 'BATTLING' ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {gameState === 'BATTLING' ? 'COMBAT ENGAGED' : 'ONLINE'}
          </span></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr,auto] gap-8">
        
        {/* --- MAIN GAME VIEWPORT (State Switcher) --- */}
        <div className="flex justify-center items-start w-full">
          {gameState === 'EXPLORING' ? (
            <OverworldCanvas onMove={handlePlayerMoveOnGrid} onEncounter={handleEncounter} />
  ) : (
    <BattleArena 
      onFlee={handleFlee} 
      onVictory={() => {
        addLog("Sync Successful! Gained 25 Bio-Mass.");
        setGameState('EXPLORING');
      }} 
    />
  )}
        </div>

        {/* --- SIDE PANEL --- */}
        <div className="xl:w-80 flex flex-col gap-6">
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-emerald-300 mb-3 border-b-2 border-emerald-900 pb-1">System Logs</h2>
            <div className="text-xs text-emerald-500 space-y-2 h-32 overflow-y-auto flex flex-col justify-end">
              {logs.map((log, i) => (
                <div key={i} className={`leading-relaxed ${log.includes('WARNING') ? 'text-red-400 font-bold' : ''}`}>
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