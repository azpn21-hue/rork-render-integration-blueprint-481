import { protectedProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { getOrCreateBalance, tokenBalances } from "./get-balance";
import { addTransaction, TokenTransaction } from "./get-transactions";

export const earnTokensProcedure = protectedProcedure
  .input(
    z.object({
      amount: z.number().positive(),
      reason: z.string(),
    })
  )
  .mutation(({ ctx, input }) => {
    const userId = ctx.user?.id || 'anonymous';
    const balance = getOrCreateBalance(userId);
    
    const updatedBalance = {
      available: balance.available + input.amount,
      earned: balance.earned + input.amount,
      spent: balance.spent,
      lastUpdated: new Date().toISOString(),
    };
    
    tokenBalances.set(userId, updatedBalance);
    
    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earned' as const,
      amount: input.amount,
      reason: input.reason,
      timestamp: new Date().toISOString(),
    };
    
    addTransaction(userId, transaction);
    
    console.log(`[Tokens] ${userId} earned ${input.amount} tokens: ${input.reason}`);
    
    return {
      success: true,
      balance: updatedBalance,
      transaction,
    };
  });
