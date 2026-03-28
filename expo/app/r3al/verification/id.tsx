import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVerification } from "@/app/contexts/VerificationContext";
import { Camera, Upload, CheckCircle, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function IdVerificationScreen() {
  const router = useRouter();
  const { verifyId, isVerifyingId, idError, status } = useVerification();

  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);

  const pickImage = async (type: "id" | "selfie") => {
    const { status: permStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permStatus !== "granted") {
      Alert.alert("Permission Required", "Please allow camera roll access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      if (type === "id") {
        setIdPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
      } else {
        setSelfiePhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const handleVerify = () => {
    if (!idPhoto || !selfiePhoto) return;

    verifyId(
      {
        idPhotoBase64: idPhoto,
        selfieBase64: selfiePhoto,
      },
      {
        onSuccess: (data) => {
          if (data.verified) {
            router.push("/r3al/verification/status");
          } else {
            Alert.alert(
              "Verification Failed",
              data.message || "Please try again with clearer photos"
            );
          }
        },
      }
    );
  };

  if (status.idVerified) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "ID Verification", headerShown: true }} />
        <View style={styles.successContainer}>
          <CheckCircle size={80} color="#00D4AA" />
          <Text style={styles.successText}>ID Already Verified</Text>
          {status.aiConfidenceScore && (
            <Text style={styles.scoreText}>
              Confidence Score: {status.aiConfidenceScore.toFixed(1)}%
            </Text>
          )}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/r3al/verification/status")}
          >
            <Text style={styles.buttonText}>View Status</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "ID Verification", headerShown: true }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Camera size={60} color="#00D4AA" />
        </View>

        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          Upload a photo of your ID and a selfie for verification
        </Text>

        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Photo ID</Text>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={() => pickImage("id")}
          >
            {idPhoto ? (
              <Image source={{ uri: idPhoto }} style={styles.photo} />
            ) : (
              <>
                <Upload size={40} color="#888" />
                <Text style={styles.photoBoxText}>Tap to upload ID</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Selfie</Text>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={() => pickImage("selfie")}
          >
            {selfiePhoto ? (
              <Image source={{ uri: selfiePhoto }} style={styles.photo} />
            ) : (
              <>
                <User size={40} color="#888" />
                <Text style={styles.photoBoxText}>Tap to take selfie</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {idError && (
          <Text style={styles.errorText}>{idError.message}</Text>
        )}

        {isVerifyingId ? (
          <ActivityIndicator size="large" color="#00D4AA" style={styles.loader} />
        ) : (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!idPhoto || !selfiePhoto) && styles.disabledButton,
            ]}
            onPress={handleVerify}
            disabled={!idPhoto || !selfiePhoto}
          >
            <Text style={styles.buttonText}>Verify Identity</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.infoText}>
          Your photos are encrypted and processed securely
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  photoBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    borderStyle: "dashed" as const,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  photoBoxText: {
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#00D4AA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  infoText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    color: "#00D4AA",
    marginBottom: 32,
  },
});
