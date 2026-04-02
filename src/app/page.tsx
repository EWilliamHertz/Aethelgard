// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 font-mono selection:bg-emerald-900 selection:text-emerald-100">
      
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 border-b border-emerald-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="text-2xl font-bold text-emerald-300 tracking-widest drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
          AETHELGARD
        </div>
        <div className="flex gap-4 items-center">
          <button className="px-4 py-2 text-sm text-emerald-500 hover:text-emerald-300 transition-colors">
            Login
          </button>
          <button className="px-5 py-2 text-sm bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500 rounded text-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-emerald-600">
          NATURE WON.
        </h1>
        <p className="text-lg md:text-xl text-emerald-600/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The Great Bloom swallowed the old world. Become a <span className="text-emerald-400">Seed-Singer</span>, pacify ancient AI Guardians, and rebuild society in a lush, overgrown Solarpunk future.
        </p>
        <Link 
          href="/play" 
          className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-lg rounded shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1"
        >
          Enter The Overgrowth
        </Link>
      </header>

      {/* Pixel Art Animation Placeholder */}
      <section className="max-w-5xl mx-auto p-6 mb-24">
        <div className="aspect-[21/9] bg-black border-2 border-emerald-900/50 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
           <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
           <p className="text-emerald-500 font-bold z-10 text-xl tracking-widest animate-pulse mb-2">
             [ PIXEL ART HERO ANIMATION ]
           </p>
           <p className="text-emerald-700 z-10 text-sm">
             (Add your stunning 2D GIF or canvas animation here later)
           </p>
        </div>
      </section>

      {/* Lore & Mechanics Grid */}
      <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-24">
         <div className="bg-neutral-900/50 border border-emerald-900/30 p-6 rounded-lg hover:border-emerald-700/50 transition-colors">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">Sync with AI</h3>
            <p className="text-emerald-600/80 text-sm leading-relaxed">
              Don't destroy the ancient machines. Use Data-Seeds to reprogram "Sprouts" and borrow their elemental power to survive the wild.
            </p>
         </div>
         <div className="bg-neutral-900/50 border border-emerald-900/30 p-6 rounded-lg hover:border-emerald-700/50 transition-colors">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">Mycelium Network</h3>
            <p className="text-emerald-600/80 text-sm leading-relaxed">
              Grow your character's abilities through a branching, organic skill tree. Invest Bio-Mass to unlock new paths and professions.
            </p>
         </div>
         <div className="bg-neutral-900/50 border border-emerald-900/30 p-6 rounded-lg hover:border-emerald-700/50 transition-colors">
            <h3 className="text-xl font-bold text-emerald-400 mb-3">Circuit League PvP</h3>
            <p className="text-emerald-600/80 text-sm leading-relaxed">
              Test your Sprouts against other Seed-Singers in tactical, turn-based battles influenced by dynamic weather and terrain.
            </p>
         </div>
      </section>
      
    </div>
  );
}