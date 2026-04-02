// src/app/play/page.tsx
"use client";

import { useState } from "react";
import usePartySocket from "partysocket/react";
import OverworldCanvas from "@/components/OverworldCanvas"; // Import our new engine!

export default function GameClient() {
  const [logs, setLogs] = useState<string[]>(["Leaf-UI Active. Welcome, Seed-Singer."]);
  const roomName = "Overgrown_Outpost"; // The starting zone

  // Connect to the real-time PartyKit server (established in previous turn)
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomName,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'PLAYER_JOINED') {
        addLog(`Network Sync: Another Seed-Singer arrived. (ID: ${data.id.slice(0,4)})`);
      }
      if (data.type === 'PLAYER_LEFT') {
        addLog(`Network Sync: A Seed-Singer lost connection. (ID: ${data.id.slice(0,4)})`);
      }
      // Future: Handle 'PLAYER_MOVED' messages from others here to draw their sprites
    },
  });

  const addLog = (msg: string) => {
    // Keep logs relevant to MMO network activity for now
    setLogs((prev) => [...prev, msg].slice(-3)); 
  };

  // Callback function passed to the Canvas
  const handlePlayerMoveOnGrid = (newPos: { x: number; y: number }) => {
    // 1. Send the movement data via PartyKit websocket to sync with other players
    socket.send(JSON.stringify({
      type: 'MOVE',
      position: newPos, // Grid coordinates
      zone: roomName
    }));
    
    // Optional: Log movement locally for debugging
    // addLog(`Local Move: Grid(${newPos.x}, ${newPos.y})`);
  };

  return (
    <main className="min-h-screen bg-black text-emerald-400 p-6 font-mono selection:bg-emerald-900">
      
      {/* Game Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b-4 border-emerald-900 pb-4 bg-neutral-950 p-4 shadow-[4px_4px_0_rgba(2,44,34,1)]">
        <h1 className="text-2xl font-black text-emerald-300 uppercase tracking-widest">[ SeedSingers ]</h1>
      <div className="flex gap-6 text-sm text-emerald-600">
          <span>ZONE: <span className="text-emerald-400">{roomName}</span></span>
          <span>STATUS: <span className="text-emerald-400 animate-pulse">ONLINE</span></span>
        </div>
      </div> {/* <--- CORRECTED CLOSING TAG */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr,auto] gap-8">
        
        {/* --- MAIN GAME VIEWPORT (Canvas Engine) --- */}
        <div className="flex justify-center items-start">
          <OverworldCanvas onMove={handlePlayerMoveOnGrid} />
        </div>

        {/* --- SIDE PANEL (Network Logs & Future Stats) --- */}
        <div className="xl:w-80 flex flex-col gap-6">
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-emerald-300 mb-3 border-b-2 border-emerald-900 pb-1">Network Logs</h2>
            <div className="text-xs text-emerald-500 space-y-2 h-24 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">{">"} {log}</div>
              ))}
            </div>
          </div>
          
          <div className="border-4 border-emerald-900 bg-neutral-950 p-5 shadow-[8px_8px_0_rgba(2,44,34,1)]">
            <h2 className="text-lg font-bold text-emerald-300 mb-3 border-b-2 border-emerald-900 pb-1">Controls</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-emerald-600">
              <div className="bg-black p-2 border border-emerald-900">MOVE: <span className="text-emerald-400">WASD / ARROWS</span></div>
              <div className="bg-black p-2 border border-emerald-900">ACTION: <span className="text-emerald-400">SPACE (Future)</span></div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}