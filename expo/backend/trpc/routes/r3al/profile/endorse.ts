import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

export const endorseProcedure = publicProcedure
  .input(
    z.object({
      fromUserId: z.string(),
      toUserId: z.string(),
      message: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[Profile] User ${input.fromUserId} endorsed ${input.toUserId}`);
    
    const endorsement = {
      id: `endorse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      message: input.message,
      trustBoost: 0.5,
      timestamp: new Date().toISOString(),
    };
    
    return {
      success: true,
      endorsement,
      message: "Endorsement added successfully",
    };
  });
