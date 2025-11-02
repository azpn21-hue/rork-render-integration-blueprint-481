import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import manifest from "@/schemas/r3al/manifest.json";
import questionnaireSchema from "@/schemas/r3al/questionnaire_schema.json";
import truthscoreSchema from "@/schemas/r3al/truthscore_schema.json";

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "free-text" | "likert" | "slider";
  options?: string[];
  scale?: number;
  labels?: string[];
  min?: number;
  max?: number;
  max_length?: number;
  weight: number;
  truth_indicator: string;
}

export interface Answer {
  questionId: string;
  value: string | number;
  timestamp: number;
}

export interface TruthScore {
  score: number;
  level: string;
  summary: string;
  details: {
    honesty: number;
    diligence: number;
    transparency: number;
    integrity: number;
    accountability: number;
    values: number;
    self_assessment: number;
    consistencyChart: any;
    analysisText: string;
  };
}

export interface Photo {
  id: string;
  url: string;
  type: "avatar" | "cover" | "gallery";
  caption?: string;
  safe: boolean;
  trustScore: number;
  uploadedAt: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  pronouns?: string;
  location?: string;
  verificationToken?: string;
  truthScore?: TruthScore;
  photos: Photo[];
  badges: string[];
  verificationLevel: number;
  endorsements: { count: number; by: string[] };
  privacy: {
    profile: "public" | "circle" | "private";
    photos: "public" | "circle" | "private";
    watchlist: "public" | "circle" | "private";
  };
  settings: {
    dm: "all" | "circle_only" | "none";
    mentions: boolean;
    alerts: { screenshots: boolean; new_endorsement: boolean };
  };
}

export interface CaptureEvent {
  id: string;
  screen: string;
  timestamp: string;
  status: "recorded" | "appeal_pending" | "resolved" | "dismissed";
}

export interface AppealSubmission {
  eventId: string;
  screen: string;
  timestamp: string;
  subject: string;
  details: string;
  submittedAt: string;
}

export interface SecurityState {
  captureStrikes: number;
  restrictionUntil: string | null;
  restrictedFeatures: string[];
  lastCaptureTimestamp: string | null;
}

export interface NFTMetadata {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  mintedAt: string;
  tokenCost: number;
  attributes?: Record<string, any>;
}

export interface NFT {
  id: string;
  metadata: NFTMetadata;
  ownerId: string;
  ownerName: string;
  forSale: boolean;
  salePrice?: number;
  transferHistory: NFTTransfer[];
}

export interface NFTTransfer {
  from: string;
  to: string;
  timestamp: string;
  type: 'mint' | 'gift' | 'purchase' | 'sale';
  price?: number;
}

export interface TokenBalance {
  available: number;
  earned: number;
  spent: number;
  lastUpdated: string;
}

export interface R3alState {
  currentScreen: string;
  onboardingPhase: number;
  hasConsented: boolean;
  isVerified: boolean;
  answers: Answer[];
  truthScore: TruthScore | null;
  userProfile: UserProfile | null;
  captureHistory: CaptureEvent[];
  security: SecurityState;
  nfts: NFT[];
  tokenBalance: TokenBalance;
  isLoading: boolean;
}

const STORAGE_KEY = "@r3al_state";

export const [R3alContext, useR3al] = createContextHook(() => {
  const [state, setState] = useState<R3alState>({
    currentScreen: "splash",
    onboardingPhase: 0,
    hasConsented: false,
    isVerified: false,
    answers: [],
    truthScore: null,
    userProfile: null,
    captureHistory: [],
    security: {
      captureStrikes: 0,
      restrictionUntil: null,
      restrictedFeatures: [],
      lastCaptureTimestamp: null,
    },
    nfts: [],
    tokenBalance: {
      available: 100,
      earned: 100,
      spent: 0,
      lastUpdated: new Date().toISOString(),
    },
    isLoading: true,
  });

  useEffect(() => {
    const initState = async () => {
      console.log("[R3AL] Init effect triggered");
      
      const timeoutId = setTimeout(() => {
        console.warn("[R3AL] LoadState timeout, forcing isLoading=false");
        setState((prev) => ({ ...prev, isLoading: false }));
      }, 3000);
      
      await loadState();
      clearTimeout(timeoutId);
    };
    initState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadState = useCallback(async () => {
    console.log("[R3AL] Starting to load state...");
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("[R3AL] AsyncStorage read complete, stored:", stored ? "yes" : "no");
      
      if (stored) {
        try {
          const parsedState = JSON.parse(stored);
          console.log("[R3AL] State parsed successfully");
          
          const securityState: SecurityState = {
            captureStrikes: parsedState.security?.captureStrikes || 0,
            restrictionUntil: parsedState.security?.restrictionUntil || null,
            restrictedFeatures: parsedState.security?.restrictedFeatures || [],
            lastCaptureTimestamp: parsedState.security?.lastCaptureTimestamp || null,
          };
          
          setState({ ...parsedState, security: securityState, isLoading: false });
          console.log("[R3AL] State loaded and set");
        } catch (parseError) {
          console.error("[R3AL] JSON parse error:", parseError);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        console.log("[R3AL] No stored state, using defaults");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("[R3AL] AsyncStorage error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    console.log("[R3AL] Load state complete");
  }, []);

  const saveState = useCallback(async (newState: Partial<R3alState>) => {
    try {
      const updated = { ...state, ...newState };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setState(updated);
    } catch (error) {
      console.error("[R3AL] Failed to save state:", error);
    }
  }, [state]);

  const setCurrentScreen = useCallback((screen: string) => {
    saveState({ currentScreen: screen });
  }, [saveState]);

  const nextOnboardingPhase = useCallback(() => {
    saveState({ onboardingPhase: state.onboardingPhase + 1 });
  }, [saveState, state.onboardingPhase]);

  const giveConsent = useCallback(() => {
    saveState({ hasConsented: true });
  }, [saveState]);

  const setVerified = useCallback((token: string) => {
    saveState({ 
      isVerified: true,
      userProfile: { ...state.userProfile, verificationToken: token } as UserProfile
    });
  }, [saveState, state.userProfile]);

  const saveAnswer = useCallback((answer: Answer) => {
    const existingIndex = state.answers.findIndex(
      (a) => a.questionId === answer.questionId
    );
    const newAnswers = [...state.answers];
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }
    
    saveState({ answers: newAnswers });
  }, [saveState, state.answers]);

  const calculateTruthScore = useCallback((): TruthScore => {
    const questions = questionnaireSchema.questions as Question[];
    const weights = truthscoreSchema.weights as Record<string, number>;
    const truthPoints = truthscoreSchema.truth_points as Record<string, Record<string, number>>;
    const textScoring = truthscoreSchema.text_scoring as Record<string, any>;
    const sliderScoring = truthscoreSchema.slider_scoring as Record<string, any>;
    const thresholds = truthscoreSchema.thresholds;

    let totalScore = 0 as number;
    let maxScore = 0 as number;
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    state.answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return;

      const weight = weights[question.id] || question.weight;
      maxScore += weight;

      let points = 0 as number;

      if (question.type === "multiple-choice" || question.type === "likert") {
        const valueStr = String(answer.value);
        points = (truthPoints[question.id]?.[valueStr] || 0) * (weight / 10);
      } else if (question.type === "free-text") {
        const scoring = textScoring[question.id];
        if (scoring) {
          const text = String(answer.value).toLowerCase();
          const hasMinLength = text.length >= scoring.min_length;
          const keywordMatches = scoring.keywords.filter((kw: string) => 
            text.includes(kw.toLowerCase())
          ).length;
          points = hasMinLength ? (keywordMatches / scoring.keywords.length) * scoring.max_points : 0;
        }
      } else if (question.type === "slider") {
        const scoring = sliderScoring[question.id];
        if (scoring) {
          points = Number(answer.value) * scoring.multiplier;
        }
      }

      totalScore += points;

      if (!categoryScores[question.truth_indicator]) {
        categoryScores[question.truth_indicator] = 0;
        categoryCounts[question.truth_indicator] = 0;
      }
      categoryScores[question.truth_indicator] += points;
      categoryCounts[question.truth_indicator] += 1;
    });

    const normalizedScore = Math.round((totalScore / maxScore) * 100);
    
    let level = "low" as string;
    if (normalizedScore >= thresholds.high) level = "high";
    else if (normalizedScore >= thresholds.medium) level = "medium";

    const summary = level === "high" 
      ? "High Honesty" 
      : level === "medium" 
      ? "Medium Honesty" 
      : "Building Trust";

    const normalizedCategories: any = {};
    Object.keys(categoryScores).forEach((cat) => {
      normalizedCategories[cat] = Math.round(
        (categoryScores[cat] / categoryCounts[cat]) * 10
      );
    });

    const truthScore: TruthScore = {
      score: normalizedScore,
      level,
      summary,
      details: {
        honesty: normalizedCategories.honesty || 0,
        diligence: normalizedCategories.diligence || 0,
        transparency: normalizedCategories.transparency || 0,
        integrity: normalizedCategories.integrity || 0,
        accountability: normalizedCategories.accountability || 0,
        values: normalizedCategories.values || 0,
        self_assessment: normalizedCategories.self_assessment || 0,
        consistencyChart: categoryScores,
        analysisText: `Your truth score of ${normalizedScore} reflects your responses across ${state.answers.length} questions.`,
      },
    };

    saveState({ truthScore });
    return truthScore;
  }, [saveState, state.answers]);

  const saveProfile = useCallback((profile: Partial<UserProfile>) => {
    const updatedProfile: UserProfile = { 
      ...state.userProfile,
      ...profile,
      photos: profile.photos || state.userProfile?.photos || [],
      badges: profile.badges || state.userProfile?.badges || ["verified_id"],
      verificationLevel: profile.verificationLevel || state.userProfile?.verificationLevel || 1,
      endorsements: profile.endorsements || state.userProfile?.endorsements || { count: 0, by: [] },
      privacy: profile.privacy || state.userProfile?.privacy || {
        profile: "circle",
        photos: "circle",
        watchlist: "public",
      },
      settings: profile.settings || state.userProfile?.settings || {
        dm: "circle_only",
        mentions: true,
        alerts: { screenshots: true, new_endorsement: true },
      },
    } as UserProfile;
    saveState({ userProfile: updatedProfile });
  }, [saveState, state.userProfile]);

  const uploadPhoto = useCallback((photo: Omit<Photo, "id" | "uploadedAt">) => {
    const newPhoto: Photo = {
      ...photo,
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString(),
    };

    const updatedPhotos = [...(state.userProfile?.photos || []), newPhoto].slice(-50);
    
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      photos: updatedPhotos,
      avatar: photo.type === "avatar" ? photo.url : state.userProfile?.avatar,
      cover: photo.type === "cover" ? photo.url : state.userProfile?.cover,
    } as UserProfile;

    console.log(`📸 [Profile] Uploaded ${photo.type} photo: ${newPhoto.id}`);
    saveState({ userProfile: updatedProfile });
    return newPhoto;
  }, [saveState, state.userProfile]);

  const deletePhoto = useCallback((photoId: string) => {
    const updatedPhotos = (state.userProfile?.photos || []).filter(p => p.id !== photoId);
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      photos: updatedPhotos,
    } as UserProfile;
    console.log(`🗑️ [Profile] Deleted photo: ${photoId}`);
    saveState({ userProfile: updatedProfile });
  }, [saveState, state.userProfile]);

  const updatePrivacy = useCallback((privacy: Partial<UserProfile["privacy"]>) => {
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      privacy: { ...state.userProfile?.privacy, ...privacy } as UserProfile["privacy"],
    } as UserProfile;
    console.log(`🔒 [Profile] Privacy updated:`, privacy);
    saveState({ userProfile: updatedProfile });
  }, [saveState, state.userProfile]);

  const updateSettings = useCallback((settings: Partial<UserProfile["settings"]>) => {
    const updatedProfile: UserProfile = {
      ...state.userProfile,
      settings: { ...state.userProfile?.settings, ...settings } as UserProfile["settings"],
    } as UserProfile;
    console.log(`⚙️ [Profile] Settings updated:`, settings);
    saveState({ userProfile: updatedProfile });
  }, [saveState, state.userProfile]);

  const addCaptureEvent = useCallback((event: Omit<CaptureEvent, "id">) => {
    const newEvent: CaptureEvent = {
      ...event,
      id: `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updatedHistory = [newEvent, ...state.captureHistory].slice(0, 50);
    
    // Ensure security object exists
    const currentSecurity = state.security || {
      captureStrikes: 0,
      restrictionUntil: null,
      restrictedFeatures: [],
      lastCaptureTimestamp: null,
    };
    
    // Update strike counter
    const newStrikes = currentSecurity.captureStrikes + 1;
    const updatedSecurity: SecurityState = {
      ...currentSecurity,
      captureStrikes: newStrikes,
      lastCaptureTimestamp: event.timestamp,
    };

    // Apply restrictions if strikes >= 3
    if (newStrikes >= 3) {
      const restrictionUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      updatedSecurity.restrictionUntil = restrictionUntil;
      updatedSecurity.restrictedFeatures = ['messages', 'vault_edit', 'hive_post'];
      console.log(`⛔ [Security] User restricted until ${restrictionUntil} due to ${newStrikes} strikes`);
    }

    console.log(`⚠️ [Security] Capture event logged. Strikes: ${newStrikes}/3`);
    saveState({ captureHistory: updatedHistory, security: updatedSecurity });
  }, [saveState, state.captureHistory, state.security]);

  const submitAppeal = useCallback(async (appeal: AppealSubmission) => {
    const updatedHistory = state.captureHistory.map((event) =>
      event.id === appeal.eventId
        ? { ...event, status: "appeal_pending" as const }
        : event
    );
    await saveState({ captureHistory: updatedHistory });
    console.log("[R3AL] Appeal submitted:", appeal);
  }, [saveState, state.captureHistory]);

  const updateCaptureEventStatus = useCallback((eventId: string, status: CaptureEvent["status"]) => {
    const updatedHistory = state.captureHistory.map((event) =>
      event.id === eventId ? { ...event, status } : event
    );
    saveState({ captureHistory: updatedHistory });
  }, [saveState, state.captureHistory]);

  const clearStrikes = useCallback(() => {
    const currentSecurity = state.security || {
      captureStrikes: 0,
      restrictionUntil: null,
      restrictedFeatures: [],
      lastCaptureTimestamp: null,
    };
    const updatedSecurity: SecurityState = {
      captureStrikes: 0,
      restrictionUntil: null,
      restrictedFeatures: [],
      lastCaptureTimestamp: currentSecurity.lastCaptureTimestamp,
    };
    console.log('✅ [Security] Strikes cleared');
    saveState({ security: updatedSecurity });
  }, [saveState, state.security]);

  const isRestricted = useCallback(() => {
    if (!state?.security || !state.security?.restrictionUntil) return false;
    return new Date().toISOString() < state.security.restrictionUntil;
  }, [state?.security]);

  const createNFT = useCallback((metadata: Omit<NFTMetadata, 'id' | 'creatorId' | 'creatorName' | 'createdAt' | 'mintedAt'>) => {
    if (state.tokenBalance.available < metadata.tokenCost) {
      throw new Error('Insufficient tokens');
    }

    const nft: NFT = {
      id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        ...metadata,
        id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        creatorId: state.userProfile?.name || 'user',
        creatorName: state.userProfile?.name || 'User',
        createdAt: new Date().toISOString(),
        mintedAt: new Date().toISOString(),
      },
      ownerId: state.userProfile?.name || 'user',
      ownerName: state.userProfile?.name || 'User',
      forSale: false,
      transferHistory: [{
        from: 'system',
        to: state.userProfile?.name || 'user',
        timestamp: new Date().toISOString(),
        type: 'mint',
      }],
    };

    const updatedBalance: TokenBalance = {
      ...state.tokenBalance,
      available: state.tokenBalance.available - metadata.tokenCost,
      spent: state.tokenBalance.spent + metadata.tokenCost,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`🎨 [NFT] Created: ${nft.metadata.title} for ${metadata.tokenCost} tokens`);
    saveState({ nfts: [...state.nfts, nft], tokenBalance: updatedBalance });
    return nft;
  }, [saveState, state.nfts, state.tokenBalance, state.userProfile]);

  const listNFTForSale = useCallback((nftId: string, price: number) => {
    const updatedNFTs = state.nfts.map(nft =>
      nft.id === nftId ? { ...nft, forSale: true, salePrice: price } : nft
    );
    console.log(`💰 [NFT] Listed for sale: ${nftId} at ${price} tokens`);
    saveState({ nfts: updatedNFTs });
  }, [saveState, state.nfts]);

  const cancelNFTListing = useCallback((nftId: string) => {
    const updatedNFTs = state.nfts.map(nft =>
      nft.id === nftId ? { ...nft, forSale: false, salePrice: undefined } : nft
    );
    console.log(`❌ [NFT] Listing cancelled: ${nftId}`);
    saveState({ nfts: updatedNFTs });
  }, [saveState, state.nfts]);

  const purchaseNFT = useCallback((nftId: string) => {
    const nft = state.nfts.find(n => n.id === nftId);
    if (!nft || !nft.forSale || !nft.salePrice) {
      throw new Error('NFT not for sale');
    }
    if (state.tokenBalance.available < nft.salePrice) {
      throw new Error('Insufficient tokens');
    }

    const transfer: NFTTransfer = {
      from: nft.ownerId,
      to: state.userProfile?.name || 'user',
      timestamp: new Date().toISOString(),
      type: 'purchase',
      price: nft.salePrice,
    };

    const updatedNFTs = state.nfts.map(n =>
      n.id === nftId
        ? {
            ...n,
            ownerId: state.userProfile?.name || 'user',
            ownerName: state.userProfile?.name || 'User',
            forSale: false,
            salePrice: undefined,
            transferHistory: [...n.transferHistory, transfer],
          }
        : n
    );

    const updatedBalance: TokenBalance = {
      ...state.tokenBalance,
      available: state.tokenBalance.available - nft.salePrice,
      spent: state.tokenBalance.spent + nft.salePrice,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`🛒 [NFT] Purchased: ${nft.metadata.title} for ${nft.salePrice} tokens`);
    saveState({ nfts: updatedNFTs, tokenBalance: updatedBalance });
  }, [saveState, state.nfts, state.tokenBalance, state.userProfile]);

  const giftNFT = useCallback((nftId: string, recipientName: string) => {
    const nft = state.nfts.find(n => n.id === nftId);
    if (!nft) throw new Error('NFT not found');
    if (nft.forSale) throw new Error('Cannot gift an NFT listed for sale');

    const transfer: NFTTransfer = {
      from: nft.ownerId,
      to: recipientName,
      timestamp: new Date().toISOString(),
      type: 'gift',
    };

    const updatedNFTs = state.nfts.map(n =>
      n.id === nftId
        ? {
            ...n,
            ownerId: recipientName,
            ownerName: recipientName,
            transferHistory: [...n.transferHistory, transfer],
          }
        : n
    );

    console.log(`🎁 [NFT] Gifted: ${nft.metadata.title} to ${recipientName}`);
    saveState({ nfts: updatedNFTs });
  }, [saveState, state.nfts]);

  const earnTokens = useCallback((amount: number, reason: string) => {
    const updatedBalance: TokenBalance = {
      available: state.tokenBalance.available + amount,
      earned: state.tokenBalance.earned + amount,
      spent: state.tokenBalance.spent,
      lastUpdated: new Date().toISOString(),
    };
    console.log(`🪙 [Tokens] Earned ${amount} tokens: ${reason}`);
    saveState({ tokenBalance: updatedBalance });
  }, [saveState, state.tokenBalance]);

  const resetR3al = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({
      currentScreen: "splash",
      onboardingPhase: 0,
      hasConsented: false,
      isVerified: false,
      answers: [],
      truthScore: null,
      userProfile: null,
      captureHistory: [],
      security: {
        captureStrikes: 0,
        restrictionUntil: null,
        restrictedFeatures: [],
        lastCaptureTimestamp: null,
      },
      nfts: [],
      tokenBalance: {
        available: 100,
        earned: 100,
        spent: 0,
        lastUpdated: new Date().toISOString(),
      },
      isLoading: false,
    });
  }, []);

  return useMemo(() => ({
    ...state,
    manifest,
    questions: questionnaireSchema.questions as Question[],
    setCurrentScreen,
    nextOnboardingPhase,
    giveConsent,
    setVerified,
    saveAnswer,
    calculateTruthScore,
    saveProfile,
    uploadPhoto,
    deletePhoto,
    updatePrivacy,
    updateSettings,
    addCaptureEvent,
    submitAppeal,
    updateCaptureEventStatus,
    clearStrikes,
    isRestricted,
    createNFT,
    listNFTForSale,
    cancelNFTListing,
    purchaseNFT,
    giftNFT,
    earnTokens,
    resetR3al,
  }), [state, setCurrentScreen, nextOnboardingPhase, giveConsent, setVerified, saveAnswer, calculateTruthScore, saveProfile, uploadPhoto, deletePhoto, updatePrivacy, updateSettings, addCaptureEvent, submitAppeal, updateCaptureEventStatus, clearStrikes, isRestricted, createNFT, listNFTForSale, cancelNFTListing, purchaseNFT, giftNFT, earnTokens, resetR3al]);
});
