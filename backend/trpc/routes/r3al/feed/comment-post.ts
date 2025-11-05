import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const commentPostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      content: z.string().min(1).max(1000),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Feed] User", ctx.user.id, "commented on post:", input.postId);

    const comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId: input.postId,
      userId: ctx.user.id,
      userName: ctx.user.id,
      content: input.content,
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      comment,
    };
  });
