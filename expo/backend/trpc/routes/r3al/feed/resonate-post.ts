import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const resonatePostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Feed] User", input.userId, "resonated with post:", input.postId);

    return {
      success: true,
      postId: input.postId,
      resonances: Math.floor(Math.random() * 100) + 1,
      userResonated: true,
      timestamp: new Date().toISOString(),
    };
  });

export const unresonatePostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Feed] User", input.userId, "unresonated with post:", input.postId);

    return {
      success: true,
      postId: input.postId,
      resonances: Math.floor(Math.random() * 100),
      userResonated: false,
      timestamp: new Date().toISOString(),
    };
  });

export const amplifyPostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      userId: z.string(),
      message: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Feed] User", input.userId, "amplified post:", input.postId);

    return {
      success: true,
      postId: input.postId,
      amplifications: Math.floor(Math.random() * 50) + 1,
      timestamp: new Date().toISOString(),
    };
  });

export const witnessPostProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Feed] User", input.userId, "witnessed post:", input.postId);

    return {
      success: true,
      postId: input.postId,
      witnesses: Math.floor(Math.random() * 30) + 1,
      timestamp: new Date().toISOString(),
    };
  });

export const likePostProcedure = resonatePostProcedure;
