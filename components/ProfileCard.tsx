import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Dimensions, PanResponder, Image } from "react-native";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Heart, X, Info, MapPin, Briefcase } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  age: number;
  location?: string;
  bio?: string;
  occupation?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onInfoPress?: () => void;
}

export default function ProfileCard({
  imageUrl,
  name,
  age,
  location,
  bio,
  occupation,
  onSwipeLeft,
  onSwipeRight,
  onInfoPress,
}: ProfileCardProps) {
  const { theme } = useTheme();
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [showDetails, setShowDetails] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        if (gesture.dx > 120) {
          swipeRight();
        } else if (gesture.dx < -120) {
          swipeLeft();
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onSwipeLeft?.();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onSwipeRight?.();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-15deg", "0deg", "15deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }, { scale }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.95)"]}
          style={styles.gradient}
        />
        <LinearGradient
          colors={["transparent", "rgba(212,137,31,0.05)"]}
          style={styles.goldGlow}
        />

        <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
          <Text style={styles.badgeText}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity }]}>
          <Text style={styles.badgeText}>NOPE</Text>
        </Animated.View>
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]}>
            {name}, {age}
          </Text>
          <Pressable
            onPress={() => {
              setShowDetails(!showDetails);
              onInfoPress?.();
            }}
            style={[styles.infoButton, { backgroundColor: theme.surfaceHover }]}
          >
            <Info size={18} color={theme.accent} />
          </Pressable>
        </View>

        {location && (
          <View style={styles.detailRow}>
            <MapPin size={14} color={theme.textMuted} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>{location}</Text>
          </View>
        )}

        {occupation && (
          <View style={styles.detailRow}>
            <Briefcase size={14} color={theme.textMuted} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>{occupation}</Text>
          </View>
        )}

        {showDetails && bio && (
          <Text style={[styles.bio, { color: theme.textSecondary }]} numberOfLines={3}>
            {bio}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <Pressable onPress={swipeLeft} style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <X size={28} color="#FF4757" strokeWidth={2.5} />
        </Pressable>

        <Pressable onPress={swipeRight} style={[styles.actionButton, styles.actionButtonLarge, { backgroundColor: theme.accent }]}>
          <Heart size={32} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 620,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1.5,
    shadowColor: "#D4891F",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 18,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  goldGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
  },
  badge: {
    position: "absolute",
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeBadge: {
    right: 30,
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    transform: [{ rotate: "20deg" }],
  },
  nopeBadge: {
    left: 30,
    borderColor: "#FF4757",
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    transform: [{ rotate: "-20deg" }],
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800" as const,
    letterSpacing: 2,
  },
  infoContainer: {
    padding: 24,
    gap: 10,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.8,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  actionButtons: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 0,
  },
});
