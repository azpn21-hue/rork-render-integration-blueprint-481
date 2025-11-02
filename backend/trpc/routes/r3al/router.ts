import { createTRPCRouter } from "@/backend/trpc/create-context";
import { verifyIdentityProcedure } from "./verify-identity/route";
import { riseNAnalyzeProcedure } from "./riseN-analyze/route";
import { optimaOptimizeProcedure } from "./optima-optimize/route";
import { createNFTProcedure } from "./nft/create";
import { listNFTForSaleProcedure } from "./nft/list-for-sale";
import { purchaseNFTProcedure } from "./nft/purchase";
import { giftNFTProcedure } from "./nft/gift";

export const r3alRouter = createTRPCRouter({
  verifyIdentity: verifyIdentityProcedure,
  riseNAnalyze: riseNAnalyzeProcedure,
  optimaOptimize: optimaOptimizeProcedure,
  createNFT: createNFTProcedure,
  listNFTForSale: listNFTForSaleProcedure,
  purchaseNFT: purchaseNFTProcedure,
  giftNFT: giftNFTProcedure,
});
