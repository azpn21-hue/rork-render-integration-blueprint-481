import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const giftNFTProcedure = publicProcedure
  .input(
    z.object({
      nftId: z.string(),
      fromId: z.string(),
      toId: z.string(),
      toName: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tRPC] giftNFT called:", input);

    const timestamp = new Date().toISOString();

    return {
      success: true,
      transfer: {
        from: input.fromId,
        to: input.toId,
        timestamp,
        type: "gift",
      },
    };
  });
