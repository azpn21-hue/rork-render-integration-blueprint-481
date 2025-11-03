import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { optimaCoreClient } from "@/lib/optima-core-client";

const submitHiveSchema = z.object({
  connections: z.array(z.string()),
  graphData: z.record(z.any()).optional(),
});

export const submitHiveProcedure = protectedProcedure
  .input(submitHiveSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const userId = ctx.user?.id || "anonymous";
      
      const result = await optimaCoreClient.submitHiveData({
        userId,
        connections: input.connections,
        timestamp: new Date().toISOString(),
        graphData: input.graphData,
      });
      
      console.log("[tRPC] Hive data submitted for user:", userId, result);
      
      return {
        success: true,
        data: result,
        message: "Hive data submitted successfully",
      };
    } catch (error: any) {
      console.error("[tRPC] Submit hive failed:", error);
      
      return {
        success: false,
        error: error.message || "Failed to submit hive data",
      };
    }
  });
