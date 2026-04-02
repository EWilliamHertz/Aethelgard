// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import usePartySocket from "partysocket/react";

export default function GameClient() {
  const [logs, setLogs] = useState<string[]>(["Initializing Aethelgard Leaf-UI..."]);
  const roomName = "Overgrown_Outpost"; // The starting zone

  // Connect to the real-time PartyKit server
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomName,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'PLAYER_JOINED') {
        addLog(`A new Seed-Singer arrived. (ID: ${data.id.slice(0,4)})`);
      }
      if (data.type === 'PLAYER_LEFT') {
        addLog(`A Seed-Singer departed. (ID: ${data.id.slice(0,4)})`);
      }
    },
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg].slice(-5)); // Keep last 5 logs
  };

  const handleSyncAttempt = () => {
    addLog("Attempting to Sync with wild AI Guardian...");
    // Here we will eventually trigger the server action to write to NeonDB
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-emerald-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto border-2 border-emerald-800 rounded-lg p-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-neutral-900">
        <h1 className="text-3xl font-bold mb-2 text-emerald-300 tracking-wider">AETHELGARD: The Overgrowth</h1>
        <p className="text-emerald-600 mb-8 border-b border-emerald-800 pb-4">Zone: {roomName}</p>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Game Viewport Placeholder */}
          <div className="col-span-2 aspect-video bg-black border border-emerald-800 rounded flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
             <p className="text-emerald-700/50 text-lg z-10">[ Canvas / PixiJS Rendering Engine ]</p>
          </div>

          {/* Side Panel: Logs & Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 border border-emerald-800 bg-black/50 p-4 rounded text-sm overflow-hidden flex flex-col justify-end">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{">"} {log}</div>
              ))}
            </div>
            
            <button 
              onClick={handleSyncAttempt}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-500 rounded transition-colors"
            >
              Throw Data-Seed
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}