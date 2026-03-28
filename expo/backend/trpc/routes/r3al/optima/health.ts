import { publicProcedure } from "../../../create-context";
import { optimaCoreClient } from "@/lib/optima-core-client";

export const optimaHealthProcedure = publicProcedure.query(async () => {
  try {
    const health = await optimaCoreClient.health();
    
    return {
      success: true,
      data: health,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("[tRPC] Optima health check failed:", error);
    
    return {
      success: false,
      error: error.message || "Failed to connect to Optima-Core",
      timestamp: new Date().toISOString(),
    };
  }
});
