import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const listNFTForSaleProcedure = publicProcedure
  .input(
    z.object({
      nftId: z.string(),
      salePrice: z.number().min(1),
      ownerId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tRPC] listNFTForSale called:", input);

    return {
      success: true,
      message: `NFT ${input.nftId} listed for ${input.salePrice} tokens`,
    };
  });
