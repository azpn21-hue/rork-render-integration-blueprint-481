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
import { sendEmailVerificationProcedure } from "./verification/send-email";
import { confirmEmailVerificationProcedure } from "./verification/confirm-email";
import { sendSmsVerificationProcedure } from "./verification/send-sms";
import { confirmSmsVerificationProcedure } from "./verification/confirm-sms";
import { verifyIdProcedure } from "./verification/verify-id";
import { getVerificationStatusProcedure, updateVerificationStatusProcedure } from "./verification/get-status";
import { suggestMatchesProcedure } from "./match/suggest";
import { compareUsersProcedure } from "./match/compare";
import { recordFeedbackProcedure } from "./match/learn";
import { getMatchHistoryProcedure } from "./match/history";
import { getMatchInsightsProcedure } from "./match/insights";
import { generateTestProfilesProcedure } from "./testing/generate-profiles";
import { generateFeedContentProcedure } from "./testing/generate-feed-content";
import { generateInteractionsProcedure } from "./testing/generate-interactions";
import { testMatchingProcedure } from "./testing/test-matching";
import { cleanupTestDataProcedure } from "./testing/cleanup-test-data";
import { runFullTestSuiteProcedure } from "./testing/run-full-test-suite";
import { getPulseStateProcedure } from "./pulse/get-state";
import { updatePulseStateProcedure } from "./pulse/update-state";
import { sharePulseProcedure } from "./pulse/share-pulse";
import { logHistoryEventProcedure } from "./history/log-event";
import { getHistoryProcedure } from "./history/get-history";
import { deleteHistoryProcedure } from "./history/delete-history";
import { getHistorySummaryProcedure } from "./history/get-summary";
import { getHiveConnectionsProcedure } from "./hive/get-connections";
import { requestHiveConnectionProcedure } from "./hive/request-connection";
import { respondHiveConnectionProcedure } from "./hive/respond-connection";
import { generateHiveNFTProcedure } from "./hive/generate-nft";
import { getHiveNFTProcedure } from "./hive/get-nft";
import { createHiveEventProcedure } from "./hive-events/create";
import { getCircleEventsProcedure } from "./hive-events/get-circle-events";
import { getEventDetailProcedure } from "./hive-events/get-detail";
import { joinEventProcedure } from "./hive-events/join";
import { leaveEventProcedure } from "./hive-events/leave";
import { submitLiveDataProcedure } from "./hive-events/submit-live-data";
import { getLiveStreamProcedure } from "./hive-events/get-live-stream";
import { completeEventProcedure } from "./hive-events/complete";
import { createNodeProcedure } from "./memory/create-node";
import { createEdgeProcedure } from "./memory/create-edge";
import { getContextProcedure } from "./memory/get-context";
import { querySimilarityProcedure } from "./memory/query-similarity";
import { explainActionProcedure } from "./memory/explain-action";
import { getPairingsProcedure } from "./memory/get-pairings";
import { trainModelProcedure } from "./training/train-model";
import { evaluateModelProcedure } from "./training/evaluate-model";
import { deployModelProcedure } from "./training/deploy-model";
import { getModelVersionsProcedure } from "./training/get-model-versions";
import { monitorModelProcedure } from "./training/monitor-model";
import { rollbackModelProcedure } from "./training/rollback-model";
import { anonymizeDataProcedure } from "./training/anonymize-data";
import { generateSyntheticDataProcedure } from "./training/generate-synthetic";
import { calculateRewardProcedure } from "./training/calculate-reward";
import { getUserTierProcedure } from "./subscription/get-user-tier";
import { checkFeatureAccessProcedure } from "./subscription/check-feature-access";
import { trackUsageProcedure } from "./subscription/track-usage";
import { upgradeTierProcedure } from "./subscription/upgrade-tier";
import { sendAiMessageProcedure } from "./ai-chat/send-message";
import { getSessionHistoryProcedure } from "./ai-chat/get-session-history";
import { createProjectProcedure } from "./writers-guild/create-project";
import { getProjectsProcedure } from "./writers-guild/get-projects";
import { startWritingSessionProcedure } from "./writers-guild/start-session";
import { getGuildMemberProcedure } from "./writers-guild/get-member";
import { registerTacticalUserProcedure } from "./tactical/register";
import { getTacticalDashboardProcedure } from "./tactical/get-dashboard";
import { sendTacticalCommProcedure } from "./tactical/send-comm";
import { getOptimaSRAnalysisProcedure } from "./tactical/optima-sr-analysis";
import { generateImageProcedure } from "./premium/generate-image";
import { getImageHistoryProcedure } from "./premium/get-image-history";
import { getUsageSummaryProcedure } from "./premium/get-usage-summary";
import { createMusicProjectProcedure } from "./studio/create-project";
import { generateMusicProcedure } from "./studio/generate-music";
import { getMusicProjectsProcedure } from "./studio/get-projects";
import { shareMusicProcedure } from "./studio/share-music";
import { getWritingAssistanceProcedure } from "./writers-guild/get-assistance";
import { upgradeMemberProcedure } from "./writers-guild/upgrade-member";
import { sendSecureCommProcedure } from "./tactical/send-secure-comm";
import { getCommsProcedure } from "./tactical/get-comms";
import { getSecureSessionsProcedure } from "./tactical/get-secure-sessions";
import { verifyAge } from "./age/verify-age";
import { requestParentalConsent } from "./age/request-parental-consent";
import { grantParentalConsent } from "./age/grant-parental-consent";
import { linkChildAccount } from "./parent/link-child-account";
import { getChildActivity } from "./parent/get-child-activity";
import { updateControls } from "./parent/update-controls";
import { emergencyPause } from "./parent/emergency-pause";
import { approveContact } from "./parent/approve-contact";
import { checkContent } from "./filter/check-content";

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
  verification: createTRPCRouter({
    sendEmail: sendEmailVerificationProcedure,
    confirmEmail: confirmEmailVerificationProcedure,
    sendSms: sendSmsVerificationProcedure,
    confirmSms: confirmSmsVerificationProcedure,
    verifyId: verifyIdProcedure,
    getStatus: getVerificationStatusProcedure,
    updateStatus: updateVerificationStatusProcedure,
  }),
  match: createTRPCRouter({
    suggest: suggestMatchesProcedure,
    compare: compareUsersProcedure,
    learn: recordFeedbackProcedure,
    history: getMatchHistoryProcedure,
    insights: getMatchInsightsProcedure,
  }),
  testing: createTRPCRouter({
    generateProfiles: generateTestProfilesProcedure,
    generateFeed: generateFeedContentProcedure,
    generateInteractions: generateInteractionsProcedure,
    testMatching: testMatchingProcedure,
    cleanup: cleanupTestDataProcedure,
    runFullSuite: runFullTestSuiteProcedure,
  }),
  pulse: createTRPCRouter({
    getState: getPulseStateProcedure,
    updateState: updatePulseStateProcedure,
    sharePulse: sharePulseProcedure,
  }),
  history: createTRPCRouter({
    logEvent: logHistoryEventProcedure,
    getHistory: getHistoryProcedure,
    deleteHistory: deleteHistoryProcedure,
    getSummary: getHistorySummaryProcedure,
  }),
  hive: createTRPCRouter({
    getConnections: getHiveConnectionsProcedure,
    requestConnection: requestHiveConnectionProcedure,
    respondConnection: respondHiveConnectionProcedure,
    generateNFT: generateHiveNFTProcedure,
    getNFT: getHiveNFTProcedure,
  }),
  hiveEvents: createTRPCRouter({
    create: createHiveEventProcedure,
    getCircleEvents: getCircleEventsProcedure,
    getDetail: getEventDetailProcedure,
    join: joinEventProcedure,
    leave: leaveEventProcedure,
    submitLiveData: submitLiveDataProcedure,
    getLiveStream: getLiveStreamProcedure,
    complete: completeEventProcedure,
  }),
  memory: createTRPCRouter({
    createNode: createNodeProcedure,
    createEdge: createEdgeProcedure,
    getContext: getContextProcedure,
    querySimilarity: querySimilarityProcedure,
    explainAction: explainActionProcedure,
    getPairings: getPairingsProcedure,
  }),
  training: createTRPCRouter({
    trainModel: trainModelProcedure,
    evaluateModel: evaluateModelProcedure,
    deployModel: deployModelProcedure,
    getModelVersions: getModelVersionsProcedure,
    monitorModel: monitorModelProcedure,
    rollbackModel: rollbackModelProcedure,
    anonymizeData: anonymizeDataProcedure,
    generateSynthetic: generateSyntheticDataProcedure,
    calculateReward: calculateRewardProcedure,
  }),
  subscription: createTRPCRouter({
    getUserTier: getUserTierProcedure,
    checkFeatureAccess: checkFeatureAccessProcedure,
    trackUsage: trackUsageProcedure,
    upgradeTier: upgradeTierProcedure,
  }),
  aiChat: createTRPCRouter({
    sendMessage: sendAiMessageProcedure,
    getSessionHistory: getSessionHistoryProcedure,
  }),
  premium: createTRPCRouter({
    generateImage: generateImageProcedure,
    getImageHistory: getImageHistoryProcedure,
    getUsageSummary: getUsageSummaryProcedure,
  }),
  studio: createTRPCRouter({
    createProject: createMusicProjectProcedure,
    generateMusic: generateMusicProcedure,
    getProjects: getMusicProjectsProcedure,
    shareMusic: shareMusicProcedure,
  }),
  writersGuild: createTRPCRouter({
    createProject: createProjectProcedure,
    getProjects: getProjectsProcedure,
    startSession: startWritingSessionProcedure,
    getMember: getGuildMemberProcedure,
    getAssistance: getWritingAssistanceProcedure,
    upgradeMember: upgradeMemberProcedure,
  }),
  tactical: createTRPCRouter({
    register: registerTacticalUserProcedure,
    getDashboard: getTacticalDashboardProcedure,
    sendComm: sendTacticalCommProcedure,
    getOptimaSRAnalysis: getOptimaSRAnalysisProcedure,
    sendSecureComm: sendSecureCommProcedure,
    getComms: getCommsProcedure,
    getSecureSessions: getSecureSessionsProcedure,
  }),
  age: createTRPCRouter({
    verifyAge: verifyAge,
    requestParentalConsent: requestParentalConsent,
    grantParentalConsent: grantParentalConsent,
  }),
  parent: createTRPCRouter({
    linkChildAccount: linkChildAccount,
    getChildActivity: getChildActivity,
    updateControls: updateControls,
    emergencyPause: emergencyPause,
    approveContact: approveContact,
  }),
  filter: createTRPCRouter({
    checkContent: checkContent,
  }),
});
