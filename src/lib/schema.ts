
import { sql, relations } from 'drizzle-orm';
import { text, integer, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  fullName: text('full_name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['patient', 'doctor', 'admin'] }).default('patient').notNull(),
  hospitalId: integer('hospital_id').references(() => hospitals.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	hospital: one(hospitals, {
		fields: [users.hospitalId],
		references: [hospitals.id],
	}),
    summaries: many(summaries),
    chats: many(chats),
    queueEntries: many(queue),
}));

export const hospitals = sqliteTable('hospitals', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const hospitalsRelations = relations(hospitals, ({ many }) => ({
	users: many(users),
    doctors: many(doctors),
    queue: many(queue),
}));

export const doctors = sqliteTable('doctors', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    hospitalId: integer('hospital_id').notNull().references(() => hospitals.id, { onDelete: 'cascade' }),
    specialty: text('specialty'),
});

export const doctorsRelations = relations(doctors, ({ one }) => ({
	user: one(users, {
		fields: [doctors.userId],
		references: [users.id],
	}),
    hospital: one(hospitals, {
        fields: [doctors.hospitalId],
        references: [hospitals.id],
    }),
}));

export const summaries = sqliteTable('summaries', {
    id: integer('id').primaryKey(),
    patientId: integer('patient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    conversationId: text('conversation_id').notNull().unique(),
    summaryText: text('summary_text').notNull(),
    triageCode: text('triage_code', { enum: ['red', 'yellow', 'green'] }).notNull(),
    suggestedNextSteps: text('suggested_next_steps'),
    status: text('status', { enum: ['new', 'reviewed', 'follow-up'] }).default('new').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const summariesRelations = relations(summaries, ({ one }) => ({
	patient: one(users, {
		fields: [summaries.patientId],
		references: [users.id],
	}),
    queueEntry: one(queue, {
        fields: [summaries.id],
        references: [queue.summaryId],
    }),
}));


export const queue = sqliteTable('queue', {
    id: integer('id').primaryKey(),
    patientId: integer('patient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    hospitalId: integer('hospital_id').notNull().references(() => hospitals.id, { onDelete: 'cascade' }),
    summaryId: integer('summary_id').notNull().references(() => summaries.id, { onDelete: 'cascade' }).unique(),
    status: text('status', { enum: ['waiting', 'in-progress', 'completed'] }).default('waiting').notNull(),
    priority: integer('priority').default(3).notNull(), // 1: high, 2: medium, 3: low
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const queueRelations = relations(queue, ({ one }) => ({
    patient: one(users, {
        fields: [queue.patientId],
        references: [users.id],
    }),
    hospital: one(hospitals, {
        fields: [queue.hospitalId],
        references: [hospitals.id],
    }),
    summary: one(summaries, {
        fields: [queue.summaryId],
        references: [summaries.id],
    }),
}));

export const chats = sqliteTable('chats', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    message: text('message').notNull(),
    sender: text('sender', { enum: ['user', 'bot'] }).notNull(),
    conversationId: text('conversation_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const chatsRelations = relations(chats, ({ one }) => ({
    user: one(users, {
        fields: [chats.userId],
        references: [users.id],
    }),
}));

// Add a new patient user
export const newPatientUser = {
  id: 1,
  fullName: 'New Patient',
  email: 'patient@example.com',
  password: 'password123',
  role: 'patient',
  hospitalId: 1,
};
