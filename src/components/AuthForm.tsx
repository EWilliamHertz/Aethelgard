// src/components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/app/actions/auth';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const action = mode === 'register' ? registerUser : loginUser;
    
    const result = await action(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push('/play'); // Redirect to the engine room!
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-neutral-900 border border-emerald-900/50 p-6 rounded-lg w-80 shadow-2xl">
      <h2 className="text-2xl font-bold text-emerald-400 mb-2">
        {mode === 'register' ? 'Join the Harvest' : 'Sync Network'}
      </h2>
      
      {error && <div className="text-red-400 text-sm border border-red-900 bg-red-950/50 p-2 rounded">{error}</div>}
      
      <input 
        name="username" 
        type="text" 
        placeholder="Seed-Singer Name" 
        required 
        className="bg-black border border-emerald-900 text-emerald-300 px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
      />
      
      <input 
        name="password" 
        type="password" 
        placeholder="Passcode" 
        required 
        className="bg-black border border-emerald-900 text-emerald-300 px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Syncing...' : (mode === 'register' ? 'Initialize' : 'Access')}
      </button>
    </form>
  );
}