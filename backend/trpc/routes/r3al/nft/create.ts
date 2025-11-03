import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { getOrCreateBalance, tokenBalances } from "../tokens/get-balance";
import { addTransaction, TokenTransaction } from "../tokens/get-transactions";

export const createNFTProcedure = protectedProcedure
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
  .mutation(async ({ ctx, input }) => {
    console.log("[tRPC] createNFT called:", input);
    
    const userId = ctx.user?.id || 'anonymous';
    const balance = getOrCreateBalance(userId);
    
    if (balance.available < input.tokenCost) {
      throw new Error('Insufficient tokens to mint NFT');
    }

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
    
    const updatedBalance = {
      available: balance.available - input.tokenCost,
      earned: balance.earned,
      spent: balance.spent + input.tokenCost,
      lastUpdated: new Date().toISOString(),
    };
    
    tokenBalances.set(userId, updatedBalance);
    
    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent' as const,
      amount: input.tokenCost,
      reason: `Minted NFT: ${input.title}`,
      timestamp: new Date().toISOString(),
    };
    
    addTransaction(userId, transaction);
    
    console.log(`[NFT] ${userId} minted NFT "${input.title}" for ${input.tokenCost} tokens`);

    return {
      success: true,
      nft,
      balance: updatedBalance,
      transaction,
    };
  });
