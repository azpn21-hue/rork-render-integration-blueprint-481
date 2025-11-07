import { createTRPCRouter } from "../../create-context";
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
import { createPostProcedure } from "./feed/create-post";
import { getTrendingProcedure } from "./feed/get-trending";
import { getLocalProcedure } from "./feed/get-local";
import { likePostProcedure } from "./feed/like-post";
import { resonatePostProcedure, unresonatePostProcedure, amplifyPostProcedure, witnessPostProcedure } from "./feed/resonate-post";
import { commentPostProcedure } from "./feed/comment-post";
import { getMarketSummaryProcedure } from "./market/get-summary";
import { getTrendingSymbolsProcedure } from "./market/get-trending-symbols";
import { getMarketNewsProcedure } from "./market/get-news";
import { getInsightsProcedure } from "./ai/get-insights";
import { getPersonalizedSummaryProcedure } from "./ai/get-personalized-summary";
import { analyzeTrendsProcedure } from "./ai/analyze-trends";
import { getLocalNewsProcedure } from "./location/get-local-news";
import { getLocalEventsProcedure } from "./location/get-local-events";
import { getNearbyUsersProcedure } from "./location/get-nearby-users";
import { getRecommendationsProcedure } from "./ml/get-recommendations";
import { trackActivityProcedure, getActivityHistoryProcedure, getActivityStatsProcedure } from "./activity/track";
import { followUserProcedure, unfollowUserProcedure, getFollowersProcedure, getFollowingProcedure, isFollowingProcedure, getSuggestedUsersProcedure } from "./social/follow";

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
  feed: createTRPCRouter({
    createPost: createPostProcedure,
    getTrending: getTrendingProcedure,
    getLocal: getLocalProcedure,
    likePost: likePostProcedure,
    resonatePost: resonatePostProcedure,
    unresonatePost: unresonatePostProcedure,
    amplifyPost: amplifyPostProcedure,
    witnessPost: witnessPostProcedure,
    commentPost: commentPostProcedure,
  }),
  market: createTRPCRouter({
    getSummary: getMarketSummaryProcedure,
    getTrendingSymbols: getTrendingSymbolsProcedure,
    getNews: getMarketNewsProcedure,
  }),
  ai: createTRPCRouter({
    getInsights: getInsightsProcedure,
    getPersonalizedSummary: getPersonalizedSummaryProcedure,
    analyzeTrends: analyzeTrendsProcedure,
  }),
  location: createTRPCRouter({
    getLocalNews: getLocalNewsProcedure,
    getLocalEvents: getLocalEventsProcedure,
    getNearbyUsers: getNearbyUsersProcedure,
  }),
  ml: createTRPCRouter({
    getRecommendations: getRecommendationsProcedure,
  }),
  activity: createTRPCRouter({
    track: trackActivityProcedure,
    getHistory: getActivityHistoryProcedure,
    getStats: getActivityStatsProcedure,
  }),
  social: createTRPCRouter({
    followUser: followUserProcedure,
    unfollowUser: unfollowUserProcedure,
    getFollowers: getFollowersProcedure,
    getFollowing: getFollowingProcedure,
    isFollowing: isFollowingProcedure,
    getSuggestedUsers: getSuggestedUsersProcedure,
  }),
});
