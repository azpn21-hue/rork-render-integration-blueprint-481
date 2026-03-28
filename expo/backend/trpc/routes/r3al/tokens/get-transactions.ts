import { protectedProcedure } from "@/backend/trpc/create-context";

export interface TokenTransaction {
  id: string;
  type: "earned" | "spent" | "gifted_received" | "gifted_sent";
  amount: number;
  reason: string;
  timestamp: string;
}

const transactionHistory = new Map<string, TokenTransaction[]>();

function getTransactions(userId: string): TokenTransaction[] {
  if (!transactionHistory.has(userId)) {
    transactionHistory.set(userId, [
      {
        id: `tx_${Date.now()}_1`,
        type: "earned",
        amount: 100,
        reason: "Welcome bonus",
        timestamp: new Date().toISOString(),
      },
    ]);
  }
  return transactionHistory.get(userId)!;
}

function addTransaction(userId: string, transaction: TokenTransaction) {
  const transactions = getTransactions(userId);
  transactions.unshift(transaction);
  if (transactions.length > 100) {
    transactions.pop();
  }
  transactionHistory.set(userId, transactions);
}

export const getTransactionsProcedure = protectedProcedure.query(({ ctx }) => {
  const userId = ctx.user?.id || 'anonymous';
  const transactions = getTransactions(userId);
  
  console.log(`[Tokens] Get transactions for ${userId}: ${transactions.length} found`);
  
  return {
    success: true,
    transactions,
  };
});

export { getTransactions, addTransaction, transactionHistory };
