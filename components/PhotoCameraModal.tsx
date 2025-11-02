import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Platform, ActivityIndicator, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Camera, X, FlipHorizontal, Image as ImageIcon, Check } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

interface PhotoCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photoData: string) => void;
  photoType: "avatar" | "cover" | "gallery";
  title?: string;
}

export default function PhotoCameraModal({ 
  visible, 
  onClose, 
  onCapture, 
  photoType,
  title = "Take Photo" 
}: PhotoCameraModalProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && permission && !permission.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsProcessing(true);
      console.log("[Camera] Taking photo...");
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: false,
        exif: false,
      });
      
      if (photo?.uri) {
        console.log("[Camera] Photo captured, processing...");
        setCapturedPhoto(photo.uri);
        console.log("[Camera] Photo ready:", photo.uri.substring(0, 50));
      }
    } catch (error) {
      console.error("[Camera] Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      console.log("[Camera] Opening gallery...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: photoType === "avatar" ? [1, 1] : photoType === "cover" ? [16, 9] : undefined,
        quality: 0.6,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        console.log("[Camera] Photo selected from gallery:", result.assets[0].uri.substring(0, 50));
        setCapturedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("[Camera] Error picking photo:", error);
      Alert.alert("Error", "Failed to pick photo from gallery.");
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      console.log("[Camera] Confirming photo:", capturedPhoto.substring(0, 50));
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleCancel = () => {
    setCapturedPhoto(null);
    onClose();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.permissionContainer}>
              <Camera size={60} color={tokens.colors.gold} />
              <Text style={[styles.permissionTitle, { color: tokens.colors.text }]}>
                Camera Permission Required
              </Text>
              <Text style={[styles.permissionText, { color: tokens.colors.textSecondary }]}>
                We need access to your camera to take photos for your profile.
              </Text>
              <TouchableOpacity
                style={[styles.permissionButton, { backgroundColor: tokens.colors.gold }]}
                onPress={requestPermission}
              >
                <Text style={[styles.permissionButtonText, { color: tokens.colors.secondary }]}>
                  Grant Permission
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={[styles.cancelButtonText, { color: tokens.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        {capturedPhoto ? (
          <View style={styles.previewContainer}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
              <Text style={[styles.title, { color: tokens.colors.text }]}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <X size={28} color={tokens.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.preview}>
              <Image 
                source={{ uri: capturedPhoto }} 
                style={styles.previewImage}
                resizeMode={photoType === "cover" ? "cover" : "contain"}
              />
            </View>

            <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: tokens.colors.surface }]}
                onPress={handleRetake}
              >
                <Camera size={24} color={tokens.colors.text} />
                <Text style={[styles.controlButtonText, { color: tokens.colors.text }]}>
                  Retake
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, styles.confirmButton, { backgroundColor: tokens.colors.gold }]}
                onPress={handleConfirmPhoto}
              >
                <Check size={24} color={tokens.colors.secondary} />
                <Text style={[styles.controlButtonText, { color: tokens.colors.secondary }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {Platform.OS !== "web" ? (
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
              >
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                  <Text style={[styles.title, { color: tokens.colors.text }]}>{title}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                    <X size={28} color={tokens.colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                  <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: "rgba(0,0,0,0.6)" }]}
                    onPress={handlePickFromGallery}
                  >
                    <ImageIcon size={24} color={tokens.colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.captureButton, { borderColor: tokens.colors.gold }]}
                    onPress={handleTakePhoto}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="large" color={tokens.colors.gold} />
                    ) : (
                      <View style={[styles.captureButtonInner, { backgroundColor: tokens.colors.gold }]} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: "rgba(0,0,0,0.6)" }]}
                    onPress={toggleCameraFacing}
                  >
                    <FlipHorizontal size={24} color={tokens.colors.text} />
                  </TouchableOpacity>
                </View>
              </CameraView>
            ) : (
              <View style={styles.webFallback}>
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                  <Text style={[styles.title, { color: tokens.colors.text }]}>{title}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                    <X size={28} color={tokens.colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.webContent}>
                  <ImageIcon size={80} color={tokens.colors.textSecondary} />
                  <Text style={[styles.webTitle, { color: tokens.colors.text }]}>
                    Camera not available on web
                  </Text>
                  <Text style={[styles.webText, { color: tokens.colors.textSecondary }]}>
                    Please select a photo from your gallery
                  </Text>
                  
                  <TouchableOpacity 
                    style={[styles.controlButton, styles.confirmButton, { backgroundColor: tokens.colors.gold }]}
                    onPress={handlePickFromGallery}
                  >
                    <ImageIcon size={24} color={tokens.colors.secondary} />
                    <Text style={[styles.controlButtonText, { color: tokens.colors.secondary }]}>
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  closeButton: {
    padding: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 140,
    justifyContent: "center",
  },
  confirmButton: {
    minWidth: 160,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    textAlign: "center" as const,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center" as const,
    lineHeight: 24,
  },
  permissionButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  webFallback: {
    flex: 1,
  },
  webContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  webTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    textAlign: "center" as const,
    marginTop: 20,
  },
  webText: {
    fontSize: 16,
    textAlign: "center" as const,
    lineHeight: 24,
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
});
