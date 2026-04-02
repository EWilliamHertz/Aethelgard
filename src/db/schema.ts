// src/db/schema.ts
import { pgTable, serial, text, integer, jsonb } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  bioMass: integer('bio_mass').default(0), 
  myceliumLevel: integer('mycelium_level').default(1),
  currentHp: integer('current_hp').default(100), // Added for persistence
  maxHp: integer('max_hp').default(100),         // Added for persistence
  currentZone: text('current_zone').default('Overgrown_Outpost'),
  inventory: jsonb('inventory').$type<{ itemName: string; quantity: number }[]>().default([]),
});

export const sprouts = pgTable('sprouts', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').references(() => players.id),
  species: text('species').notNull(),
  level: integer('level').default(1),
  hp: integer('hp').default(100),
});