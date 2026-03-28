import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  content: string;
  timestamp: string;
  read: boolean;
  encrypted: boolean;
}

const messageStore = new Map<string, DirectMessage[]>();

function getConversationKey(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}

function getMessagesForConversation(userId1: string, userId2: string): DirectMessage[] {
  const key = getConversationKey(userId1, userId2);
  if (!messageStore.has(key)) {
    messageStore.set(key, []);
  }
  return messageStore.get(key)!;
}

function addMessage(message: DirectMessage) {
  const key = getConversationKey(message.fromUserId, message.toUserId);
  const messages = getMessagesForConversation(message.fromUserId, message.toUserId);
  messages.push(message);
  messageStore.set(key, messages);
}

export const dmSendMessageProcedure = protectedProcedure
  .input(
    z.object({
      fromUserId: z.string(),
      toUserId: z.string(),
      fromUserName: z.string(),
      toUserName: z.string(),
      content: z.string().min(1).max(2000),
    })
  )
  .mutation(async ({ input }) => {
    const { fromUserId, toUserId, fromUserName, toUserName, content } = input;

    const message: DirectMessage = {
      id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      fromUserName,
      toUserName,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      encrypted: true,
    };

    addMessage(message);

    console.log(`[DM API] Message sent from ${fromUserName} to ${toUserName}: ${message.id}`);

    return {
      success: true,
      message,
    };
  });

export { getMessagesForConversation, messageStore };
