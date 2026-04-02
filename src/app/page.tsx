// src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function LandingPage() {
  // Add state to track which mode we are in
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono">
      
      {/* Retro Navigation Bar */}
      <nav className="flex justify-between items-center p-4 border-b-4 border-emerald-900 bg-neutral-950">
        <div className="text-2xl font-black text-emerald-500 tracking-widest uppercase">
          [ SEEDSINGERS ]
        </div>
        <div className="text-sm text-emerald-700">v0.0.1_ALPHA</div>
      </nav>

      {/* Hero Section & Auth Split */}
      <header className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-emerald-400 uppercase tracking-tighter drop-shadow-[4px_4px_0_rgba(2,44,34,1)]">
            Nature Won.
          </h1>
          <p className="text-lg text-emerald-600 mb-8 leading-relaxed bg-neutral-900 p-4 border-l-4 border-emerald-700">
            The Great Bloom swallowed the old world. Become a Seed-Singer, pacify ancient AI Guardians, and rebuild society in a lush, turn-based Solarpunk future.
          </p>
          
          <div className="flex gap-4">
            <Link 
              href="#lore" 
              className="px-6 py-3 bg-neutral-950 border-2 border-emerald-800 text-emerald-500 font-bold uppercase hover:bg-emerald-950 transition-colors"
            >
              Read Data-Logs
            </Link>
          </div>
        </div>

        {/* The Auth Terminal (Now Interactive!) */}
        <div className="bg-neutral-900 border-4 border-emerald-800 p-6 shadow-[8px_8px_0_rgba(2,44,34,1)]">
           <AuthForm mode={authMode} />
           
           <div className="mt-4 text-center text-xs text-emerald-700">
             {authMode === 'register' ? (
               <>
                 Already synced?{' '}
                 <button onClick={() => setAuthMode('login')} className="text-emerald-500 underline hover:text-emerald-300">
                   Login Sequence
                 </button>
               </>
             ) : (
               <>
                 New to the network?{' '}
                 <button onClick={() => setAuthMode('register')} className="text-emerald-500 underline hover:text-emerald-300">
                   Initialize Seed-Singer
                 </button>
               </>
             )}
           </div>
        </div>
      </header>

      {/* Pixel Art Banner */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] bg-neutral-950 border-4 border-emerald-900 flex flex-col items-center justify-center relative shadow-[8px_8px_0_rgba(2,44,34,1)] overflow-hidden">
           {/* Make sure your image is in the public/images folder! */}
           <img 
             src="/images/seed-singers-hero.png" 
             alt="SeedSingers Pixel Art" 
             className="w-full h-full object-cover"
           />
        </div>
      </section>
      // Triggering Vercel Redeploy
    </div>
  );
}