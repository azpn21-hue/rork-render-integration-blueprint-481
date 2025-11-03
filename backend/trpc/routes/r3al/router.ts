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
import { startSessionProcedure } from "./pulse-chat/start-session";
import { sendMessageProcedure } from "./pulse-chat/send-message";
import { startVideoProcedure } from "./pulse-chat/start-video";
import { startRealificationProcedure } from "./pulse-chat/start-realification";
import { finishRealificationProcedure } from "./pulse-chat/finish-realification";
import { startHonestyCheckProcedure } from "./pulse-chat/start-honesty-check";
import { finishHonestyCheckProcedure } from "./pulse-chat/finish-honesty-check";
import { getBalanceProcedure } from "./tokens/get-balance";
import { earnTokensProcedure } from "./tokens/earn-tokens";
import { spendTokensProcedure } from "./tokens/spend-tokens";
import { getTransactionsProcedure } from "./tokens/get-transactions";
import { dmSendMessageProcedure } from "./dm/send-message";
import { dmGetConversationsProcedure } from "./dm/get-conversations";
import { dmMarkReadProcedure } from "./dm/mark-read";
import { dmGetMessagesProcedure } from "./dm/get-messages";
import { optimaHealthProcedure } from "./optima/health";
import { logPulseProcedure } from "./optima/log-pulse";
import { submitHiveProcedure } from "./optima/submit-hive";
import { createNFTProcedure as optimaCreateNFTProcedure } from "./optima/create-nft";

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
  pulseChat: createTRPCRouter({
    startSession: startSessionProcedure,
    sendMessage: sendMessageProcedure,
    startVideo: startVideoProcedure,
    startRealification: startRealificationProcedure,
    finishRealification: finishRealificationProcedure,
    startHonestyCheck: startHonestyCheckProcedure,
    finishHonestyCheck: finishHonestyCheckProcedure,
  }),
  tokens: createTRPCRouter({
    getBalance: getBalanceProcedure,
    earnTokens: earnTokensProcedure,
    spendTokens: spendTokensProcedure,
    getTransactions: getTransactionsProcedure,
  }),
  dm: createTRPCRouter({
    sendMessage: dmSendMessageProcedure,
    getConversations: dmGetConversationsProcedure,
    markRead: dmMarkReadProcedure,
    getMessages: dmGetMessagesProcedure,
  }),
  optima: createTRPCRouter({
    health: optimaHealthProcedure,
    logPulse: logPulseProcedure,
    submitHive: submitHiveProcedure,
    createNFT: optimaCreateNFTProcedure,
  }),
});
