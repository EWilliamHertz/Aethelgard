// src/app/actions/auth.ts
'use server';

import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev');

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password || password.length < 6) {
    return { error: 'Username and password (min 6 chars) required.' };
  }

  try {
    // 1. Check if Seed-Singer already exists
    const existing = await db.select().from(players).where(eq(players.username, username));
    if (existing.length > 0) return { error: 'Username already claimed by another Seed-Singer.' };

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert into NeonDB
    const [newUser] = await db.insert(players).values({
      username,
      passwordHash: hashedPassword,
      bioMass: 100, // Starter currency!
    }).returning();

    // 4. Log them in immediately
    await createSession(newUser.id, newUser.username);
    return { success: true };
  } catch (err) {
    return { error: 'Failed to sync with the network.' };
  }
}

export async function loginUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // 1. Find user in NeonDB
  const userRecord = await db.select().from(players).where(eq(players.username, username));
  if (userRecord.length === 0) return { error: 'Seed-Singer not found.' };

  const user = userRecord[0];

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return { error: 'Incorrect sequence.' };

  // 3. Create session cookie
  await createSession(user.id, user.username);
  return { success: true };
}

// Helper to create an HTTP-only JWT cookie
async function createSession(userId: number, username: string) {
  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);

  // We await the cookies() promise before setting it
  const cookieStore = await cookies();
  cookieStore.set('SeedSingers_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}