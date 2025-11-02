import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const createNFTProcedure = publicProcedure
  .input(
    z.object({
      title: z.string().min(1).max(50),
      description: z.string().max(300).optional(),
      imageUrl: z.string().url(),
      tokenCost: z.number().min(1),
      creatorId: z.string(),
      creatorName: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tRPC] createNFT called:", input);

    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const nft = {
      id: nftId,
      metadata: {
        id: nftId,
        title: input.title,
        description: input.description || "",
        imageUrl: input.imageUrl,
        creatorId: input.creatorId,
        creatorName: input.creatorName,
        createdAt: timestamp,
        mintedAt: timestamp,
        tokenCost: input.tokenCost,
      },
      ownerId: input.creatorId,
      ownerName: input.creatorName,
      forSale: false,
      transferHistory: [
        {
          from: "system",
          to: input.creatorId,
          timestamp,
          type: "mint",
        },
      ],
    };

    return {
      success: true,
      nft,
    };
  });
