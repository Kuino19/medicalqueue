
import { z } from 'zod';

// Schema for Text-to-Speech Action & Flow
export const TextToSpeechInputSchema = z.object({
  text: z.string(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
    media: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


// Schema for Chat Page Messages
export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  sender: z.enum(['user', 'bot']),
  audioUrl: z.string().optional(),
});
export type Message = z.infer<typeof MessageSchema>;


// Schema for AI API Route
export const AiRouteSchema = z.object({
  message: z.string(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model', 'bot']),
    content: z.string(),
  })).optional().default([]),
  conversationId: z.string(),
  patientId: z.number(),
});


// Schema for Chat Summary Flow - Now handled by flows/summarize-chat-flow.ts
// This keeps schemas co-located with their usage.
// export const SummarizeChatInputSchema = z.object({ ... })
// export const SummarizeChatOutputSchema = z.object({ ... })
