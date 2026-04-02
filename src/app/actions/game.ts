'use server';

import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function saveProgress(data: any) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('aethelgard_session')?.value;
    if (!session) return { success: false, error: 'No Session' };

    const { payload } = await jwtVerify(session, SECRET);
    const userId = payload.userId as number;

    // Use a fast update. Ensure your Neon DB URL has ?sslmode=require
    await db.update(players)
      .set({
        bioMass: data.bioMass,
        myceliumLevel: data.myceliumLevel,
        inventory: data.inventory,
        // Ensure these columns exist in your schema!
        currentHp: data.playerHp,
        maxHp: data.maxHp,
      })
      .where(eq(players.id, userId));

    return { success: true };
  } catch (e) {
    console.error("Save Error:", e);
    return { success: false, error: 'Database Timeout' };
  }
}