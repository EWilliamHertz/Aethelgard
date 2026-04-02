// src/app/page.tsx
import Link from "next/link";
import AuthForm from "@/components/AuthForm"; // We import the login system here!

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono">
      
      {/* Retro Navigation Bar */}
      <nav className="flex justify-between items-center p-4 border-b-4 border-emerald-900 bg-neutral-950">
        <div className="text-2xl font-black text-emerald-500 tracking-widest uppercase">
          [ AETHELGARD ]
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

        {/* The Auth Terminal */}
        <div className="bg-neutral-900 border-4 border-emerald-800 p-6 shadow-[8px_8px_0_rgba(2,44,34,1)]">
           <AuthForm mode="register" />
           <div className="mt-4 text-center text-xs text-emerald-700">
             Already synced? <button className="text-emerald-500 underline hover:text-emerald-300">Login Sequence</button>
           </div>
        </div>
      </header>

      {/* Pixel Art Animation Placeholder */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="aspect-[21/9] bg-neutral-950 border-4 border-emerald-900 flex flex-col items-center justify-center relative shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <img 
  src="/images/seed-singers-hero.png" 
  alt="Lush, overgrown cyberpunk city with Seed-Singer and mechanical deer"
  className="max-w-full h-auto" // Optional styling to make it responsive
/>
        </div>
      </section>
      
    </div>
  );
}