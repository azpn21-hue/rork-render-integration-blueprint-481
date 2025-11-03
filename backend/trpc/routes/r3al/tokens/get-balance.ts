import { protectedProcedure } from "@/backend/trpc/create-context";

interface TokenBalance {
  available: number;
  earned: number;
  spent: number;
  lastUpdated: string;
}

const tokenBalances = new Map<string, TokenBalance>();

function getOrCreateBalance(userId: string): TokenBalance {
  if (!tokenBalances.has(userId)) {
    tokenBalances.set(userId, {
      available: 100,
      earned: 100,
      spent: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
  return tokenBalances.get(userId)!;
}

export const getBalanceProcedure = protectedProcedure.query(({ ctx }) => {
  const userId = ctx.user?.id || 'anonymous';
  const balance = getOrCreateBalance(userId);
  
  console.log(`[Tokens] Get balance for ${userId}:`, balance);
  
  return {
    success: true,
    balance,
  };
});

export { getOrCreateBalance, tokenBalances };
