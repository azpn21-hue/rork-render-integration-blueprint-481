import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Shield, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  onPress?: () => void;
}

export default function VerifiedBadge({
  isVerified,
  size = "medium",
  showLabel = true,
  onPress,
}: VerifiedBadgeProps) {
  const router = useRouter();

  const iconSize = size === "small" ? 16 : size === "medium" ? 20 : 24;
  const labelSize = size === "small" ? 10 : size === "medium" ? 12 : 14;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!isVerified) {
      router.push("/r3al/verification/email");
    } else {
      router.push("/r3al/verification/status");
    }
  };

  if (!isVerified && !showLabel) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        size === "small" && styles.containerSmall,
        size === "large" && styles.containerLarge,
        isVerified ? styles.containerVerified : styles.containerUnverified,
      ]}
      onPress={handlePress}
    >
      {isVerified ? (
        <>
          <CheckCircle size={iconSize} color="#00D4AA" />
          {showLabel && (
            <Text style={[styles.label, { fontSize: labelSize }, styles.labelVerified]}>
              R3AL Verified
            </Text>
          )}
        </>
      ) : (
        <>
          <Shield size={iconSize} color="#888" />
          {showLabel && (
            <Text style={[styles.label, { fontSize: labelSize }, styles.labelUnverified]}>
              Not Verified
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  containerSmall: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  containerLarge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  containerVerified: {
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    borderWidth: 1,
    borderColor: "#00D4AA",
  },
  containerUnverified: {
    backgroundColor: "rgba(136, 136, 136, 0.1)",
    borderWidth: 1,
    borderColor: "#444",
  },
  label: {
    fontWeight: "600" as const,
  },
  labelVerified: {
    color: "#00D4AA",
  },
  labelUnverified: {
    color: "#888",
  },
});
