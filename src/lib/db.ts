import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const client = createClient({ 
  url: process.env.DATABASE_URL || "file:./local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
});

export type DB = typeof db;

// Helper function to insert a user with proper typing
export async function insertUser(userData: {
  fullName: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  hospitalId: number;
}) {
  return db.insert(schema.users).values(userData);
}

// Helper function to update queue status with proper typing
export async function _updateQueueStatusDb(queueId: number, status: 'waiting' | 'in-progress' | 'completed') {
  return db.update(schema.queue)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .set({ status } as any)
    .where(eq(schema.queue.id, queueId));
}
