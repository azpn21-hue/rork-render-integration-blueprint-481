import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const purchaseNFTProcedure = publicProcedure
  .input(
    z.object({
      nftId: z.string(),
      buyerId: z.string(),
      buyerName: z.string(),
      price: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tRPC] purchaseNFT called:", input);

    const timestamp = new Date().toISOString();

    return {
      success: true,
      transfer: {
        from: "seller",
        to: input.buyerId,
        timestamp,
        type: "purchase",
        price: input.price,
      },
    };
  });
