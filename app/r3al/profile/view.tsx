import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, TextInput } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Camera, 
  Edit3, 
  Shield, 
  Award, 
  Heart, 
  Settings,
  Share2,
  ChevronLeft,
  Plus,
  X,
  CheckCircle,
  Lock,
  Sparkles
} from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import PhotoCameraModal from "@/components/PhotoCameraModal";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function ProfileView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, truthScore, uploadPhoto, deletePhoto, saveProfile } = useR3al();
  
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraType, setCameraType] = useState<"avatar" | "cover" | "gallery">("avatar");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(userProfile?.bio || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.name || "");
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim]);

  const handleOpenCamera = (type: "avatar" | "cover" | "gallery") => {
    console.log(`[Profile] Opening camera for ${type}`);
    setCameraType(type);
    setCameraVisible(true);
  };

  const handlePhotoCapture = async (photoData: string) => {
    try {
      console.log(`[Profile] Uploading ${cameraType} photo...`);
      
      const photo = uploadPhoto({
        url: photoData,
        type: cameraType,
        safe: true,
        trustScore: 95,
      });

      console.log(`[Profile] ${cameraType} photo uploaded:`, photo.id);
      Alert.alert("Success", `${cameraType} photo uploaded successfully!`);
    } catch (error) {
      console.error("[Profile] Error uploading photo:", error);
      Alert.alert("Error", "Failed to upload photo. Please try again.");
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePhoto(photoId);
            console.log("[Profile] Photo deleted:", photoId);
          },
        },
      ]
    );
  };

  const handleSaveBio = () => {
    saveProfile({ bio: editedBio });
    setIsEditingBio(false);
    console.log("[Profile] Bio updated");
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      saveProfile({ name: editedName.trim() });
      setIsEditingName(false);
      console.log("[Profile] Name updated");
    }
  };

  const trustScoreValue = truthScore?.score || userProfile?.truthScore?.score || 84;
  const badges = userProfile?.badges || ["verified_id"];
  const photos = userProfile?.photos || [];
  const galleryPhotos = photos.filter(p => p.type === "gallery");

  const stats = [
    { label: "Trust", value: trustScoreValue.toString(), icon: Shield, color: tokens.colors.gold },
    { label: "Verified", value: badges.length.toString(), icon: CheckCircle, color: "#00FF66" },
    { label: "Photos", value: galleryPhotos.length.toString(), icon: Camera, color: "#00D4FF" },
    { label: "Endorsements", value: (userProfile?.endorsements?.count || 0).toString(), icon: Heart, color: "#FF4757" },
  ];

  return (
    <>
      <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: tokens.colors.surface }]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={tokens.colors.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: tokens.colors.text }]}>Profile</Text>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: tokens.colors.surface }]}
              onPress={() => console.log("Settings")}
            >
              <Settings size={20} color={tokens.colors.text} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
            <View style={styles.coverContainer}>
              {userProfile?.cover ? (
                <img 
                  src={userProfile.cover} 
                  alt="Cover"
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                />
              ) : (
                <LinearGradient
                  colors={[tokens.colors.gold, tokens.colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.coverPlaceholder}
                />
              )}
              <TouchableOpacity
                style={[styles.coverEditButton, { backgroundColor: "rgba(0,0,0,0.7)" }]}
                onPress={() => handleOpenCamera("cover")}
              >
                <Camera size={20} color={tokens.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.cardContent, { backgroundColor: tokens.colors.surface }]}>
              <View style={styles.avatarRow}>
                <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
                  <View style={[styles.avatarBorder, { borderColor: tokens.colors.gold }]}>
                    {userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar"
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 55,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: tokens.colors.backgroundSecondary }]}>
                        <Text style={[styles.avatarInitial, { color: tokens.colors.gold }]}>
                          {(userProfile?.name || "U")[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[styles.avatarEditButton, { backgroundColor: tokens.colors.gold }]}
                    onPress={() => handleOpenCamera("avatar")}
                  >
                    <Camera size={18} color={tokens.colors.secondary} />
                  </TouchableOpacity>
                </Animated.View>

                <View style={styles.trustBadge}>
                  <View style={[styles.trustRing, { borderColor: tokens.colors.gold }]}>
                    <Text style={[styles.trustScore, { color: tokens.colors.gold }]}>
                      {trustScoreValue}
                    </Text>
                  </View>
                  <Text style={[styles.trustLabel, { color: tokens.colors.textSecondary }]}>
                    Trust Score
                  </Text>
                </View>
              </View>

              <View style={styles.nameSection}>
                {isEditingName ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={[styles.nameInput, { color: tokens.colors.text, borderColor: tokens.colors.gold }]}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Enter your name"
                      placeholderTextColor={tokens.colors.textSecondary}
                      autoFocus
                    />
                    <View style={styles.editButtons}>
                      <TouchableOpacity onPress={() => setIsEditingName(false)}>
                        <X size={20} color={tokens.colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveName}>
                        <CheckCircle size={20} color={tokens.colors.gold} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    <Text style={[styles.userName, { color: tokens.colors.text }]}>
                      {userProfile?.name || "User"}
                    </Text>
                    <TouchableOpacity onPress={() => setIsEditingName(true)}>
                      <Edit3 size={18} color={tokens.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.badgeRow}>
                  {badges.map((badge) => (
                    <View key={badge} style={[styles.badge, { backgroundColor: tokens.colors.backgroundSecondary, borderColor: tokens.colors.gold }]}>
                      {badge === "verified_id" && <Shield size={14} color={tokens.colors.gold} />}
                      {badge === "trusted" && <Award size={14} color="#00FF66" />}
                      {badge === "pro_verified" && <Sparkles size={14} color="#00D4FF" />}
                      <Text style={[styles.badgeText, { color: tokens.colors.gold }]}>
                        {badge.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {isEditingBio ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={[styles.bioInput, { color: tokens.colors.text, borderColor: tokens.colors.gold }]}
                    value={editedBio}
                    onChangeText={setEditedBio}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={tokens.colors.textSecondary}
                    multiline
                    maxLength={200}
                    autoFocus
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity onPress={() => setIsEditingBio(false)}>
                      <X size={20} color={tokens.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveBio}>
                      <CheckCircle size={20} color={tokens.colors.gold} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.bioContainer}
                  onPress={() => setIsEditingBio(true)}
                >
                  <Text style={[styles.bio, { color: tokens.colors.textSecondary }]}>
                    {userProfile?.bio || "Tap to add a bio"}
                  </Text>
                  <Edit3 size={16} color={tokens.colors.textSecondary} />
                </TouchableOpacity>
              )}

              <View style={styles.statsRow}>
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <View key={index} style={[styles.statItem, { backgroundColor: tokens.colors.backgroundSecondary }]}>
                      <Icon size={20} color={stat.color} strokeWidth={2.5} />
                      <Text style={[styles.statValue, { color: tokens.colors.text }]}>{stat.value}</Text>
                      <Text style={[styles.statLabel, { color: tokens.colors.textSecondary }]}>{stat.label}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: tokens.colors.gold }]}
                  onPress={() => router.push("/r3al/profile/setup")}
                >
                  <Edit3 size={18} color={tokens.colors.secondary} />
                  <Text style={[styles.actionButtonText, { color: tokens.colors.secondary }]}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: tokens.colors.backgroundSecondary, borderColor: tokens.colors.border, borderWidth: 2 }]}
                  onPress={() => console.log("Share")}
                >
                  <Share2 size={18} color={tokens.colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>Photo Gallery</Text>
              <TouchableOpacity onPress={() => handleOpenCamera("gallery")}>
                <Text style={[styles.addPhoto, { color: tokens.colors.gold }]}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.photoGrid}>
              {galleryPhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoItem}
                  onLongPress={() => handleDeletePhoto(photo.id)}
                >
                  <img 
                    src={photo.url} 
                    alt="Gallery"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16,
                    }}
                  />
                  {photo.safe && (
                    <View style={[styles.safetyBadge, { backgroundColor: "rgba(0,255,102,0.9)" }]}>
                      <CheckCircle size={12} color="#000" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.photoItem, styles.addPhotoItem, { backgroundColor: tokens.colors.backgroundSecondary, borderColor: tokens.colors.border }]}
                onPress={() => handleOpenCamera("gallery")}
              >
                <Plus size={32} color={tokens.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.privacyNote, { backgroundColor: tokens.colors.surface }]}>
            <Lock size={16} color={tokens.colors.textSecondary} />
            <Text style={[styles.privacyText, { color: tokens.colors.textSecondary }]}>
              Your profile photos are moderated and encrypted. Only verified users can see them based on your privacy settings.
            </Text>
          </View>
        </ScrollView>
      </View>

      <PhotoCameraModal
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={handlePhotoCapture}
        photoType={cameraType}
        title={`Add ${cameraType === "avatar" ? "Profile Photo" : cameraType === "cover" ? "Cover Photo" : "Gallery Photo"}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  profileCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  coverContainer: {
    position: "relative",
    height: 200,
  },
  coverPlaceholder: {
    width: "100%",
    height: 200,
  },
  coverEditButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 24,
    gap: 20,
    marginTop: -60,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBorder: {
    borderWidth: 4,
    borderRadius: 60,
    padding: 4,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: "700" as const,
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  trustBadge: {
    alignItems: "center",
    gap: 8,
  },
  trustRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  trustScore: {
    fontSize: 24,
    fontWeight: "800" as const,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  nameSection: {
    gap: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  editContainer: {
    gap: 12,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "700" as const,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
  editButtons: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "flex-end",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bio: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 15,
    lineHeight: 22,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top" as const,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  addPhoto: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoItem: {
    width: "31.5%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  addPhotoItem: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed" as const,
  },
  safetyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
