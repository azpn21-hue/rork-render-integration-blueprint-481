import React, { useRef, useState } from "react";
import { View, Image, StyleSheet, Dimensions, Pressable, Animated, ScrollView } from "react-native";
import { useTheme } from "@/app/contexts/ThemeContext";
import { X, Share2, Heart } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PhotoGalleryProps {
  photos: string[];
  initialIndex?: number;
  onClose?: () => void;
}

export default function PhotoGallery({ photos, initialIndex = 0, onClose }: PhotoGalleryProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const likeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    Animated.sequence([
      Animated.spring(likeAnim, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(likeAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.overlay, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: initialIndex * SCREEN_WIDTH, y: 0 }}
      >
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.9)"]}
              style={styles.photoGradient}
            />
            <LinearGradient
              colors={["transparent", "rgba(212,137,31,0.08)" ]}
              style={styles.goldAccent}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.topBar}>
        <Pressable
          onPress={handleClose}
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
        >
          <X size={24} color={theme.text} strokeWidth={2} />
        </Pressable>

        <View style={styles.indicators}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === activeIndex ? theme.accent : theme.textMuted,
                  opacity: index === activeIndex ? 1 : 0.4,
                  width: index === activeIndex ? 32 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.spacer} />
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => console.log("Share")}
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
        >
          <Share2 size={22} color={theme.text} strokeWidth={2} />
        </Pressable>

        <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
          <Pressable
            onPress={handleLike}
            style={[
              styles.iconButton,
              styles.likeButton,
              { backgroundColor: liked ? "#FF4757" : theme.surface },
            ]}
          >
            <Heart
              size={22}
              color={liked ? "#FFFFFF" : theme.text}
              strokeWidth={2}
              fill={liked ? "#FFFFFF" : "transparent"}
            />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  goldAccent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "25%",
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4891F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  indicators: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    transition: "all 0.3s ease" as any,
  },
  spacer: {
    width: 48,
  },
});
