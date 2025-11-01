import { router } from "@/backend/trpc/create-context";
import { verifyIdentityProcedure } from "./verify-identity/route";
import { riseNAnalyzeProcedure } from "./riseN-analyze/route";
import { optimaOptimizeProcedure } from "./optima-optimize/route";

export const r3alRouter = router({
  verifyIdentity: verifyIdentityProcedure,
  riseNAnalyze: riseNAnalyzeProcedure,
  optimaOptimize: optimaOptimizeProcedure,
});
