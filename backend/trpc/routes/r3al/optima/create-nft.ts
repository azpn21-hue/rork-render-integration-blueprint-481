import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { optimaCoreClient } from "@/lib/optima-core-client";

const createNFTSchema = z.object({
  nftType: z.string(),
  metadata: z.record(z.any()),
  credentialData: z.record(z.any()).optional(),
});

export const createNFTProcedure = protectedProcedure
  .input(createNFTSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const userId = ctx.user?.id || "anonymous";
      
      const result = await optimaCoreClient.createNFT({
        userId,
        nftType: input.nftType,
        metadata: input.metadata,
        credentialData: input.credentialData,
      });
      
      console.log("[tRPC] NFT created for user:", userId, result);
      
      return {
        success: true,
        data: result,
        message: "NFT credential created successfully",
      };
    } catch (error: any) {
      console.error("[tRPC] Create NFT failed:", error);
      
      return {
        success: false,
        error: error.message || "Failed to create NFT credential",
      };
    }
  });
