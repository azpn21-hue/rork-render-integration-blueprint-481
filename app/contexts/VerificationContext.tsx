import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  voiceVerified: boolean;
  aiConfidenceScore: number | null;
  verificationBadge: string | null;
  isFullyVerified: boolean;
  completionPercentage: number;
  lastUpdated: Date;
}

const VERIFICATION_STORAGE_KEY = "@r3al_verification_status";

export const [VerificationProvider, useVerification] = createContextHook(() => {
  const [status, setStatus] = useState<VerificationStatus>({
    emailVerified: false,
    phoneVerified: false,
    idVerified: false,
    voiceVerified: false,
    aiConfidenceScore: null,
    verificationBadge: null,
    isFullyVerified: false,
    completionPercentage: 0,
    lastUpdated: new Date(),
  });

  const statusQuery = trpc.r3al.verification.getStatus.useQuery(undefined, {
    staleTime: 60000,
    retry: 2,
    retryDelay: 1000,
    onSuccess: (data) => {
      if (data) {
        setStatus(data as VerificationStatus);
        AsyncStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(data));
      }
    },
    onError: (error) => {
      console.error("[Verification] Failed to fetch status:", error.message);
    },
  });

  const sendEmailMutation = trpc.r3al.verification.sendEmail.useMutation();
  const confirmEmailMutation = trpc.r3al.verification.confirmEmail.useMutation({
    onSuccess: (data) => {
      if (data.verified) {
        updateStatusMutation.mutate({ emailVerified: true });
      }
    },
  });

  const sendSmsMutation = trpc.r3al.verification.sendSms.useMutation();
  const confirmSmsMutation = trpc.r3al.verification.confirmSms.useMutation({
    onSuccess: (data) => {
      if (data.verified) {
        updateStatusMutation.mutate({ phoneVerified: true });
      }
    },
  });

  const verifyIdMutation = trpc.r3al.verification.verifyId.useMutation({
    onSuccess: (data) => {
      if (data.verified) {
        updateStatusMutation.mutate({
          idVerified: true,
          aiConfidenceScore: data.aiConfidenceScore,
        });
      }
    },
  });

  const updateStatusMutation = trpc.r3al.verification.updateStatus.useMutation({
    onSuccess: (data) => {
      if (data.status) {
        setStatus({
          ...data.status,
          isFullyVerified: data.isFullyVerified,
          completionPercentage: Math.round(
            ((data.status.emailVerified ? 1 : 0) +
              (data.status.phoneVerified ? 1 : 0) +
              (data.status.idVerified ? 1 : 0) +
              (data.status.voiceVerified ? 0.5 : 0)) /
              3.5 *
              100
          ),
        });
        statusQuery.refetch();
      }
    },
  });

  useEffect(() => {
    const loadCachedStatus = async () => {
      try {
        const cached = await AsyncStorage.getItem(VERIFICATION_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setStatus(parsed);
        }
      } catch (error) {
        console.error("[Verification] Failed to load cached status:", error);
      }
    };

    loadCachedStatus();
  }, []);

  return {
    status,
    isLoading: statusQuery.isLoading,
    sendEmail: sendEmailMutation.mutate,
    confirmEmail: confirmEmailMutation.mutate,
    sendSms: sendSmsMutation.mutate,
    confirmSms: confirmSmsMutation.mutate,
    verifyId: verifyIdMutation.mutate,
    refetchStatus: statusQuery.refetch,
    isSendingEmail: sendEmailMutation.isPending,
    isConfirmingEmail: confirmEmailMutation.isPending,
    isSendingSms: sendSmsMutation.isPending,
    isConfirmingSms: confirmSmsMutation.isPending,
    isVerifyingId: verifyIdMutation.isPending,
    emailError: confirmEmailMutation.error,
    smsError: confirmSmsMutation.error,
    idError: verifyIdMutation.error,
    emailDevCode: sendEmailMutation.data?.devCode,
    smsDevCode: sendSmsMutation.data?.devCode,
  };
});
