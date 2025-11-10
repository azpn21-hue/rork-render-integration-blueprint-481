import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getHiveNFTProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const userId = input.userId || ctx.user?.id || "anonymous";
    
    console.log(`[Hive] Getting NFT for user: ${userId}`);

    const hasNFT = Math.random() > 0.3;

    if (!hasNFT) {
      return {
        hasNFT: false,
        userId,
      };
    }

    return {
      hasNFT: true,
      userId,
      nft: {
        nftId: `nft_existing_${userId}`,
        tokenId: Math.floor(Math.random() * 1000000),
        metadata: {
          name: `Pulse ID #${Math.floor(Math.random() * 1000000)}`,
          description: "Your unique digital pulse identity",
          image: `https://i.pravatar.cc/400?u=${userId}`,
          attributes: [
            { trait_type: "Pulse Signature", value: "60,65,62,68,64" },
            { trait_type: "Emotional State", value: "calm" },
            { trait_type: "Heartbeat", value: 60 },
          ],
        },
        mintedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        blockchain: "polygon",
      },
    };
  });
