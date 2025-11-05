import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const createPostProcedure = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1).max(5000),
      mediaUrl: z.string().url().optional(),
      location: z.string().optional(),
      tags: z.array(z.string()).optional(),
      tier: z.enum(["free", "premium", "unlimited"]).default("free"),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Feed] Creating post for user:", ctx.user.id);

    const post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: ctx.user.id,
      content: input.content,
      mediaUrl: input.mediaUrl,
      location: input.location,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      tier: input.tier,
      tags: input.tags || [],
      userName: ctx.user.id,
      userAvatar: null,
    };

    console.log("[Feed] Post created:", post.id);
    
    return {
      success: true,
      post,
    };
  });
