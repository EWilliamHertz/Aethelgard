// src/app/actions/game.ts
'use server';

import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function saveProgress(data: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get('aethelgard_session')?.value;
  if (!session) return { error: 'Not authenticated' };

  try {
    const { payload } = await jwtVerify(session, SECRET);
    const userId = payload.userId as number;

    // Update the player's stats in the database
    await db.update(players)
      .set({
        bioMass: data.bioMass,
        myceliumLevel: data.myceliumLevel,
        inventory: data.inventory,
        // currentHp and maxHp will be saved here once added to schema
      })
      .where(eq(players.id, userId));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to save' };
  }
}