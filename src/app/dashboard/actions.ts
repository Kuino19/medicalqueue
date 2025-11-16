'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { summaries, users, chats, queue } from '@/lib/schema';
import { desc, eq, asc } from 'drizzle-orm';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';

const getQueueSchema = z.object({
  hospitalId: z.number(),
});

export async function getPatientQueue(input: z.infer<typeof getQueueSchema>) {
    const parsedInput = getQueueSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error("Invalid input for getting queue.");
    }

    const queueData = await db.query.queue.findMany({
        with: {
            patient: {
                columns: {
                    fullName: true,
                }
            },
            summary: {
                columns: {
                    triageCode: true,
                }
            }
        },
        where: eq(queue.hospitalId, parsedInput.data.hospitalId),
        orderBy: [asc(queue.priority), asc(queue.createdAt)],
    });

    return queueData.map(q => ({
        id: q.id.toString(),
        patientName: q.patient?.fullName || 'Unknown Patient',
        date: format(new Date(q.createdAt! * 1000), 'yyyy-MM-dd HH:mm'),
        status: q.status,
        summaryId: q.summaryId,
        triageCode: q.summary?.triageCode,
    }));
}


const getSummaryDetailsSchema = z.object({
    summaryId: z.number(),
});

export async function getSummaryDetails(input: z.infer<typeof getSummaryDetailsSchema>) {
    const parsedInput = getSummaryDetailsSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error("Invalid input for getting summary details.");
    }
    
    const summary = await db.query.summaries.findFirst({
        where: eq(summaries.id, parsedInput.data.summaryId),
        with: {
            patient: {
                columns: {
                    fullName: true,
                }
            }
        }
    });

    if (!summary) {
        return null;
    }

    const conversation = await db.query.chats.findMany({
        where: eq(chats.conversationId, summary.conversationId),
        orderBy: (chats, { asc }) => [asc(chats.createdAt)],
    });

    return {
        summary,
        conversation
    };
}


const updateQueueStatusSchema = z.object({
    queueId: z.number(),
    status: z.enum(['waiting', 'in-progress', 'completed']),
});

export async function updateQueueStatus(input: z.infer<typeof updateQueueStatusSchema>) {
    const parsedInput = updateQueueStatusSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error("Invalid input for updating queue status.");
    }
    
    try {
        await db.update(queue)
            .set({ status: parsedInput.data.status })
            .where(eq(queue.id, parsedInput.data.queueId));
        
        revalidatePath('/dashboard'); // This tells Next.js to refresh the dashboard page data
        return { success: true, message: `Status updated to ${parsedInput.data.status}` };
    } catch (error) {
        console.error("Failed to update queue status", error);
        return { success: false, message: 'Failed to update status.' };
    }
}
