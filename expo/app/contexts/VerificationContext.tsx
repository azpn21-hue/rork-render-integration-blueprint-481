import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const statusQuery = trpc.r3al.verification.getStatus.useQuery(undefined, {
    enabled: false,
    staleTime: 60000,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (statusQuery.data) {
      setStatus(statusQuery.data as VerificationStatus);
      AsyncStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(statusQuery.data));
    }
  }, [statusQuery.data]);

  useEffect(() => {
    if (statusQuery.error) {
      console.error("[Verification] Failed to fetch status:", statusQuery.error.message);
    }
  }, [statusQuery.error]);

  const sendEmailMutation = trpc.r3al.verification.sendEmail.useMutation();
  const confirmEmailMutation = trpc.r3al.verification.confirmEmail.useMutation();

  const sendSmsMutation = trpc.r3al.verification.sendSms.useMutation();
  const confirmSmsMutation = trpc.r3al.verification.confirmSms.useMutation();

  const verifyIdMutation = trpc.r3al.verification.verifyId.useMutation();

  const updateStatusMutation = trpc.r3al.verification.updateStatus.useMutation();

  useEffect(() => {
    if (confirmEmailMutation.data?.verified) {
      updateStatusMutation.mutate({ emailVerified: true });
    }
  }, [confirmEmailMutation.data]);

  useEffect(() => {
    if (confirmSmsMutation.data?.verified) {
      updateStatusMutation.mutate({ phoneVerified: true });
    }
  }, [confirmSmsMutation.data]);

  useEffect(() => {
    if (verifyIdMutation.data?.verified) {
      updateStatusMutation.mutate({
        idVerified: true,
        aiConfidenceScore: verifyIdMutation.data.aiConfidenceScore,
      });
    }
  }, [verifyIdMutation.data]);

  useEffect(() => {
    if (updateStatusMutation.data?.status) {
      const data = updateStatusMutation.data;
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
  }, [updateStatusMutation.data]);

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

  const refetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      await statusQuery.refetch();
    } finally {
      setIsLoading(false);
    }
  }, [statusQuery]);

  return {
    status,
    isLoading: isLoading || statusQuery.isLoading,
    sendEmail: sendEmailMutation.mutate,
    confirmEmail: confirmEmailMutation.mutate,
    sendSms: sendSmsMutation.mutate,
    confirmSms: confirmSmsMutation.mutate,
    verifyId: verifyIdMutation.mutate,
    refetchStatus,
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
