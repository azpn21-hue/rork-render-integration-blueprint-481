import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { messageStore } from "./send-message";

export const dmGetConversationsProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId } = input;

    console.log(`[DM API] Fetching conversations for user: ${userId}`);

    const conversations: any[] = [];
    const conversationMap = new Map<string, any>();
    let totalUnread = 0;

    for (const [, messages] of messageStore.entries()) {
      const relevantMessages = messages.filter(
        (msg) => msg.fromUserId === userId || msg.toUserId === userId
      );

      if (relevantMessages.length === 0) continue;

      relevantMessages.forEach((msg) => {
        const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
        const otherUserName = msg.fromUserId === userId ? msg.toUserName : msg.fromUserName;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUserName,
            lastMessage: msg.content,
            lastMessageTime: msg.timestamp,
            unreadCount: msg.toUserId === userId && !msg.read ? 1 : 0,
            encrypted: msg.encrypted,
          });
        } else {
          const existing = conversationMap.get(otherUserId);
          if (new Date(msg.timestamp) > new Date(existing.lastMessageTime)) {
            existing.lastMessage = msg.content;
            existing.lastMessageTime = msg.timestamp;
          }
          if (msg.toUserId === userId && !msg.read) {
            existing.unreadCount += 1;
          }
        }
      });
    }

    for (const conv of conversationMap.values()) {
      conversations.push(conv);
      totalUnread += conv.unreadCount;
    }

    conversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    console.log(`[DM API] Found ${conversations.length} conversations for ${userId}`);

    return {
      success: true,
      conversations,
      totalUnread,
    };
  });
