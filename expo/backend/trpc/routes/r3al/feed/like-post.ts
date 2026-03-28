import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const likePostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[Feed] User", ctx.user.id, "liked post:", input.postId);

    return {
      success: true,
      postId: input.postId,
      likes: Math.floor(Math.random() * 100),
    };
  });
