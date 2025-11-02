import { createTRPCRouter } from "@/backend/trpc/create-context";
import { verifyIdentityProcedure } from "./verify-identity/route";
import { riseNAnalyzeProcedure } from "./riseN-analyze/route";
import { optimaOptimizeProcedure } from "./optima-optimize/route";
import { createNFTProcedure } from "./nft/create";
import { listNFTForSaleProcedure } from "./nft/list-for-sale";
import { purchaseNFTProcedure } from "./nft/purchase";
import { giftNFTProcedure } from "./nft/gift";
import { getDailyQuestionProcedure } from "./qotd/get-daily";
import { submitAnswerProcedure } from "./qotd/submit-answer";
import { getStatsProcedure } from "./qotd/get-stats";
import { updateProfileProcedure } from "./profile/update-profile";
import { uploadPhotoProcedure } from "./profile/upload-photo";
import { deletePhotoProcedure } from "./profile/delete-photo";
import { getProfileProcedure } from "./profile/get-profile";
import { endorseProcedure } from "./profile/endorse";

export const r3alRouter = createTRPCRouter({
  verifyIdentity: verifyIdentityProcedure,
  riseNAnalyze: riseNAnalyzeProcedure,
  optimaOptimize: optimaOptimizeProcedure,
  createNFT: createNFTProcedure,
  listNFTForSale: listNFTForSaleProcedure,
  purchaseNFT: purchaseNFTProcedure,
  giftNFT: giftNFTProcedure,
  qotd: createTRPCRouter({
    getDaily: getDailyQuestionProcedure,
    submitAnswer: submitAnswerProcedure,
    getStats: getStatsProcedure,
  }),
  profile: createTRPCRouter({
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
    uploadPhoto: uploadPhotoProcedure,
    deletePhoto: deletePhotoProcedure,
    endorse: endorseProcedure,
  }),
});
