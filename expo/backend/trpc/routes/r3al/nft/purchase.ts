import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { getOrCreateBalance, tokenBalances } from "../tokens/get-balance";
import { addTransaction, TokenTransaction } from "../tokens/get-transactions";

export const purchaseNFTProcedure = protectedProcedure
  .input(
    z.object({
      nftId: z.string(),
      buyerId: z.string(),
      buyerName: z.string(),
      price: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("[tRPC] purchaseNFT called:", input);
    
    const userId = ctx.user?.id || 'anonymous';
    const balance = getOrCreateBalance(userId);
    
    if (balance.available < input.price) {
      throw new Error('Insufficient tokens to purchase NFT');
    }

    const timestamp = new Date().toISOString();
    
    const updatedBalance = {
      available: balance.available - input.price,
      earned: balance.earned,
      spent: balance.spent + input.price,
      lastUpdated: new Date().toISOString(),
    };
    
    tokenBalances.set(userId, updatedBalance);
    
    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent' as const,
      amount: input.price,
      reason: `Purchased NFT (ID: ${input.nftId})`,
      timestamp: new Date().toISOString(),
    };
    
    addTransaction(userId, transaction);
    
    console.log(`[NFT] ${userId} purchased NFT ${input.nftId} for ${input.price} tokens`);

    return {
      success: true,
      transfer: {
        from: "seller",
        to: input.buyerId,
        timestamp,
        type: "purchase",
        price: input.price,
      },
      balance: updatedBalance,
      transaction,
    };
  });
