import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { optimaCoreClient } from "@/lib/optima-core-client";

const logPulseSchema = z.object({
  mood: z.string().optional(),
  activity: z.string().optional(),
  location: z.string().optional(),
  interactions: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export const logPulseProcedure = protectedProcedure
  .input(logPulseSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const userId = ctx.user?.id || "anonymous";
      
      const result = await optimaCoreClient.logPulse({
        userId,
        timestamp: new Date().toISOString(),
        mood: input.mood,
        activity: input.activity,
        location: input.location,
        interactions: input.interactions,
        metadata: input.metadata,
      });
      
      console.log("[tRPC] Pulse logged for user:", userId, result);
      
      return {
        success: true,
        data: result,
        message: "Pulse data logged successfully",
      };
    } catch (error: any) {
      console.error("[tRPC] Log pulse failed:", error);
      
      return {
        success: false,
        error: error.message || "Failed to log pulse data",
      };
    }
  });
