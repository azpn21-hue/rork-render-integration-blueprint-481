import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, ActivityIndicator } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Camera, User, CheckCircle, X, RotateCcw, FlipHorizontal } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import { trpc } from "@/lib/trpc";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";
import locales from "@/schemas/r3al/locale_tokens.json";

type VerificationStep = "document" | "biometric" | "processing" | "success" | "error";

export default function IdentityVerification() {
  const router = useRouter();
  const r3alContext = useR3al();
  const { setVerified, earnTokens, userProfile } = r3alContext || {};
  const t = locales.en;
  const [step, setStep] = useState<VerificationStep>("document");
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [cameraInitialized, setCameraInitialized] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const verifyMutation = trpc.r3al.verifyIdentity.useMutation();

  useEffect(() => {
    console.log("[IdentityVerification] Component mounted");
    console.log("[IdentityVerification] R3AL Context:", {
      hasContext: !!r3alContext,
      userProfile: userProfile?.name,
      hasSetVerified: !!setVerified,
      hasEarnTokens: !!earnTokens,
    });
    console.log("[IdentityVerification] Permission:", permission);
    console.log("[IdentityVerification] Step:", step);
    
    const initCamera = async () => {
      if (isRequestingPermission) {
        console.log("[IdentityVerification] Already requesting permission, skipping");
        return;
      }

      try {
        if (!permission) {
          console.log("[IdentityVerification] No permission object yet, waiting...");
          return;
        }

        console.log("[IdentityVerification] Permission state:", {
          granted: permission.granted,
          canAskAgain: permission.canAskAgain,
          status: permission.status
        });

        if (permission.granted) {
          console.log("[IdentityVerification] Permission already granted");
          setCameraInitialized(true);
          setPermissionError(null);
          return;
        }

        if (!permission.granted && permission.canAskAgain !== false) {
          console.log("[IdentityVerification] Requesting camera permission...");
          setIsRequestingPermission(true);
          const result = await requestPermission();
          console.log("[IdentityVerification] Permission result:", result);
          setIsRequestingPermission(false);
          
          if (result && result.granted) {
            console.log("[IdentityVerification] Camera permission granted");
            setCameraInitialized(true);
            setPermissionError(null);
          } else {
            const errMsg = "Camera access is required for identity verification.";
            setError(errMsg);
            setPermissionError(errMsg);
          }
        } else if (permission.canAskAgain === false) {
          const errMsg = "Camera permission was denied. Please enable it in your device settings.";
          setError(errMsg);
          setPermissionError(errMsg);
        }
      } catch (err) {
        console.error("[IdentityVerification] Permission error:", err);
        const errMsg = "Failed to initialize camera. Please try again.";
        setError(errMsg);
        setPermissionError(errMsg);
        setIsRequestingPermission(false);
      }
    };
    
    initCamera();
  }, [permission, isRequestingPermission]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleDocumentCapture = async () => {
    try {
      if (!cameraRef.current || !cameraReady) {
        setError("Camera not ready. Please wait a moment.");
        console.log("[Verification] Camera not ready:", { hasCameraRef: !!cameraRef.current, cameraReady });
        return;
      }

      console.log("[Verification] Capturing document photo...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      if (photo?.base64) {
        setDocumentImage(`data:image/jpeg;base64,${photo.base64}`);
        setStep("biometric");
        setFacing("front");
        console.log("[Verification] Document captured successfully");
      }
    } catch (err) {
      console.error("[Verification] Document capture error:", err);
      setError("Failed to capture document. Please try again.");
    }
  };

  const handleBiometricCapture = async () => {
    try {
      if (!cameraRef.current || !cameraReady) {
        setError("Camera not ready. Please wait a moment.");
        console.log("[Verification] Camera not ready:", { hasCameraRef: !!cameraRef.current, cameraReady });
        return;
      }

      console.log("[Verification] Capturing biometric photo...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      if (photo?.base64) {
        const bioImage = `data:image/jpeg;base64,${photo.base64}`;
        setStep("processing");
        console.log("[Verification] Biometric captured, processing...");
        await processVerification(bioImage);
      }
    } catch (err) {
      console.error("[Verification] Biometric capture error:", err);
      setError("Failed to capture selfie. Please try again.");
      setStep("biometric");
    }
  };

  const processVerification = async (bioImage: string) => {
    try {
      const result = await verifyMutation.mutateAsync({
        documentImage: documentImage || "",
        biometricImage: bioImage,
        userId: userProfile?.name || "user",
      });

      console.log("[Verification] Backend response:", result);

      if (result.success) {
        if (setVerified) {
          setVerified(result.verificationToken);
        }
        if (earnTokens) {
          earnTokens(50, "Identity Verification Completed");
        }
        setStep("success");
        
        setTimeout(() => {
          console.log("[Verification] Success → /r3al/questionnaire/index");
          router.replace("/r3al/questionnaire/index");
        }, 2500);
      } else {
        setStep("error");
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("[Verification] Processing error:", err);
      setStep("error");
      setError("Verification failed. Please try again.");
    }
  };

  const resetVerification = () => {
    setStep("document");
    setFacing("back");
    setDocumentImage(null);
    setError(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.gold} />
            <Text style={styles.processingText}>Initializing camera...</Text>
            {isRequestingPermission && (
              <Text style={styles.processingHint}>Requesting permission...</Text>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Camera size={80} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.title}>Camera Permission Required</Text>
            <Text style={styles.permissionText}>
              R3AL needs access to your camera to verify your identity securely.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                try {
                  setIsRequestingPermission(true);
                  const result = await requestPermission();
                  console.log("[IdentityVerification] Manual permission request result:", result);
                  if (result && result.granted) {
                    setCameraInitialized(true);
                    setPermissionError(null);
                  }
                } catch (err) {
                  console.error("[IdentityVerification] Manual permission error:", err);
                } finally {
                  setIsRequestingPermission(false);
                }
              }}
              activeOpacity={0.8}
              disabled={isRequestingPermission}
            >
              <Text style={styles.buttonText}>
                {isRequestingPermission ? "Requesting..." : "Grant Permission"}
              </Text>
            </TouchableOpacity>
            {permissionError && (
              <Text style={styles.errorDescription}>{permissionError}</Text>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {(step === "document" || step === "biometric") && (
            <>
              <View style={styles.header}>
                {step === "document" ? (
                  <Camera size={40} color={tokens.colors.gold} strokeWidth={1.5} />
                ) : (
                  <User size={40} color={tokens.colors.gold} strokeWidth={1.5} />
                )}
                <Text style={styles.title}>
                  {step === "document" ? t.document_capture_title : t.biometric_capture_title}
                </Text>
                <Text style={styles.instructions}>
                  {step === "document" ? t.document_capture_instructions : t.biometric_capture_instructions}
                </Text>
              </View>

              <View style={styles.cameraContainer}>
                {permission?.granted && cameraInitialized ? (
                  <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                    onCameraReady={() => {
                      console.log("[Verification] Camera ready!");
                      setCameraReady(true);
                      setError(null);
                    }}
                    onMountError={(error) => {
                      console.error("[Verification] Camera mount error:", error);
                      setError(`Camera error: ${error.message || "Unknown error"}`);
                    }}
                  >
                    {step === "document" ? (
                      <View style={styles.documentOverlay}>
                        <View style={styles.frame} />
                      </View>
                    ) : (
                      <View style={styles.biometricOverlay}>
                        <View style={styles.selfieFrame} />
                      </View>
                    )}
                  </CameraView>
                ) : (
                  <View style={styles.cameraPlaceholder}>
                    <ActivityIndicator size="large" color={tokens.colors.gold} />
                    <Text style={styles.processingHint}>Initializing camera...</Text>
                    {!permission?.granted && (
                      <Text style={styles.processingHint}>Requesting camera access...</Text>
                    )}
                  </View>
                )}
                {error && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => {
                      setError(null);
                      if (!permission?.granted) {
                        requestPermission();
                      }
                    }}>
                      <X size={20} color={tokens.colors.text} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.controls}>
                {step === "biometric" && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleCameraFacing}
                    activeOpacity={0.8}
                  >
                    <FlipHorizontal size={24} color={tokens.colors.gold} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={step === "document" ? handleDocumentCapture : handleBiometricCapture}
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <View style={styles.captureButtonInner} />
                  </Animated.View>
                </TouchableOpacity>
                {step === "biometric" && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={resetVerification}
                    activeOpacity={0.8}
                  >
                    <RotateCcw size={24} color={tokens.colors.gold} />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {step === "processing" && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={tokens.colors.gold} />
              <Text style={styles.processingText}>{t.verification_processing}</Text>
              <Text style={styles.processingHint}>Analyzing biometric data...</Text>
            </View>
          )}

          {step === "success" && (
            <View style={styles.processingContainer}>
              <CheckCircle size={80} color={tokens.colors.gold} strokeWidth={1.5} />
              <Text style={styles.successTitle}>{t.verification_success}</Text>
              <Text style={styles.successText}>+50 Trust Tokens earned!</Text>
              <Text style={styles.processingHint}>Redirecting to questionnaire...</Text>
            </View>
          )}

          {step === "error" && (
            <View style={styles.processingContainer}>
              <X size={80} color="#FF4444" strokeWidth={1.5} />
              <Text style={styles.errorTitle}>Verification Failed</Text>
              <Text style={styles.errorDescription}>{error || t.verification_failure}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={resetVerification}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  permissionText: {
    fontSize: 16,
    color: tokens.colors.text,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 32,
    marginVertical: 24,
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
  },
  camera: {
    flex: 1,
  },
  documentOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  biometricOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  frame: {
    width: 300,
    height: 180,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    borderRadius: 12,
    backgroundColor: "rgba(255,215,0,0.1)",
  },
  selfieFrame: {
    width: 220,
    height: 280,
    borderWidth: 3,
    borderColor: tokens.colors.gold,
    borderRadius: 140,
    backgroundColor: "rgba(255,215,0,0.1)",
  },
  controls: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingVertical: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,215,0,0.1)",
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: tokens.colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.gold,
  },
  errorBanner: {
    position: "absolute" as const,
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,68,68,0.95)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: tokens.colors.text,
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: tokens.colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: tokens.dimensions.borderRadius,
    alignItems: "center",
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: tokens.colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  processingText: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  processingHint: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    textAlign: "center",
  },
  successText: {
    fontSize: 18,
    color: tokens.colors.text,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#FF4444",
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    gap: 16,
  },
});
