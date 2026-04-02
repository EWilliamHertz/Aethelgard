// src/db/schema.ts
import { pgTable, serial, text, integer, jsonb } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(), // NEW: Stores the encrypted password
  bioMass: integer('bio_mass').default(0), 
  myceliumLevel: integer('mycelium_level').default(1),
  currentZone: text('current_zone').default('Overgrown_Outpost'),
});


// The AI Guardians (Sprouts)
export const sprouts = pgTable('sprouts', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').references(() => players.id),
  species: text('species').notNull(), // e.g., 'Solar_Stag', 'Moss_Drone'
  type: text('type').notNull(), // 'Solar', 'Fungal', 'Root', 'Circuit'
  stats: jsonb('stats').$type<{ hp: number; speed: number; energy: number }>().notNull(),
  dnaCode: text('dna_code'), // Unique visual/stat variation
});