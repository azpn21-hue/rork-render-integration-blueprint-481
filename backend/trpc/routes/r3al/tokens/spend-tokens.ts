import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { getOrCreateBalance, tokenBalances } from "./get-balance";
import { addTransaction, TokenTransaction } from "./get-transactions";

export const spendTokensProcedure = protectedProcedure
  .input(
    z.object({
      amount: z.number().positive(),
      reason: z.string(),
    })
  )
  .mutation(({ ctx, input }) => {
    const userId = ctx.user?.id || 'anonymous';
    const balance = getOrCreateBalance(userId);
    
    if (balance.available < input.amount) {
      throw new Error('Insufficient tokens');
    }
    
    const updatedBalance = {
      available: balance.available - input.amount,
      earned: balance.earned,
      spent: balance.spent + input.amount,
      lastUpdated: new Date().toISOString(),
    };
    
    tokenBalances.set(userId, updatedBalance);
    
    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent' as const,
      amount: input.amount,
      reason: input.reason,
      timestamp: new Date().toISOString(),
    };
    
    addTransaction(userId, transaction);
    
    console.log(`[Tokens] ${userId} spent ${input.amount} tokens: ${input.reason}`);
    
    return {
      success: true,
      balance: updatedBalance,
      transaction,
    };
  });
