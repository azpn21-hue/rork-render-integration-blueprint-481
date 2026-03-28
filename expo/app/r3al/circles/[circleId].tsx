import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Send,
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Users,
  MoreVertical,
} from "lucide-react-native";
import { useCircles } from "@/app/contexts/CirclesContext";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function CircleDetailPage() {
  const router = useRouter();
  const { circleId } = useLocalSearchParams();
  const { getCircleById, postToCircle, likePost, commentOnPost, sendDirectMessage } =
    useCircles();
  const { userProfile } = useR3al();

  const circle = getCircleById(circleId as string);
  const [postContent, setPostContent] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [photoDropMode, setPhotoDropMode] = useState(false);
  const [dropAnimation, setDropAnimation] = useState<"fade" | "slide" | "bounce" | "pulse">("fade");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");

  if (!circle) {
    return (
      <LinearGradient
        colors={[tokens.colors.background, tokens.colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Circle not found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const isMember = circle.members.some((m) => m.userId === userProfile?.name);

  const handlePost = () => {
    if (!postContent.trim() && !photoUrl.trim()) {
      Alert.alert("Error", "Please enter some content or add a photo");
      return;
    }

    const type = photoUrl.trim() ? (photoDropMode ? "photo_drop" : "photo") : "text";
    postToCircle(
      circle.id,
      userProfile?.name || "user",
      userProfile?.name || "User",
      postContent.trim(),
      type,
      photoUrl.trim() || undefined,
      postContent.trim() || undefined,
      photoDropMode,
      dropAnimation
    );

    setPostContent("");
    setPhotoUrl("");
    setShowPhotoInput(false);
    setPhotoDropMode(false);
    Alert.alert("Success", photoDropMode ? "Photo Drop shared with the circle! 🎉" : "Post shared with the circle!");
  };

  const handleLike = (postId: string) => {
    likePost(postId, userProfile?.name || "user");
  };

  const handleComment = (postId: string) => {
    if (!commentContent.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }

    commentOnPost(
      postId,
      userProfile?.name || "user",
      userProfile?.name || "User",
      commentContent.trim()
    );

    setCommentContent("");
    setSelectedPost(null);
    Alert.alert("Success", "Comment posted!");
  };

  const handleDirectMessage = (memberId: string, memberName: string) => {
    Alert.prompt(
      `Send DM to ${memberName}`,
      "Enter your message:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: (message) => {
            if (message?.trim()) {
              sendDirectMessage(
                userProfile?.name || "user",
                memberId,
                userProfile?.name || "User",
                memberName,
                message.trim()
              );
              Alert.alert("Sent!", `Your message was sent to ${memberName}`);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const renderPost = ({ item }: { item: typeof circle.posts[0] }) => {
    const hasLiked = item.likes.includes(userProfile?.name || "user");
    const isCommenting = selectedPost === item.id;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postAuthorInfo}>
            <View style={styles.postAuthorAvatar}>
              <Text style={styles.postAuthorInitial}>
                {item.authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.postAuthorName}>{item.authorName}</Text>
              <Text style={styles.postTimestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.postMenuButton}>
            <MoreVertical size={20} color={tokens.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {(item.type === "photo" || item.type === "photo_drop") && item.photoUrl && (
          <View style={item.isPhotoDrop ? styles.photoDropContainer : undefined}>
            {item.isPhotoDrop && (
              <View style={styles.photoDropBadge}>
                <Text style={styles.photoDropBadgeText}>✨ Photo Drop™</Text>
              </View>
            )}
            <Image source={{ uri: item.photoUrl }} style={styles.postPhoto} resizeMode="cover" />
          </View>
        )}

        {item.content && (
          <Text style={styles.postContent}>{item.content}</Text>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.postActionButton}
            onPress={() => handleLike(item.id)}
          >
            <Heart
              size={20}
              color={hasLiked ? "#EF4444" : tokens.colors.textSecondary}
              fill={hasLiked ? "#EF4444" : "none"}
              strokeWidth={2}
            />
            <Text style={styles.postActionText}>{item.likes.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postActionButton}
            onPress={() => setSelectedPost(isCommenting ? null : item.id)}
          >
            <MessageCircle
              size={20}
              color={tokens.colors.textSecondary}
              strokeWidth={2}
            />
            <Text style={styles.postActionText}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>

        {item.comments.length > 0 && (
          <View style={styles.commentsSection}>
            {item.comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))}
          </View>
        )}

        {isCommenting && (
          <View style={styles.commentInputSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={commentContent}
              onChangeText={setCommentContent}
              multiline
            />
            <TouchableOpacity
              style={styles.commentSendButton}
              onPress={() => handleComment(item.id)}
            >
              <Send size={20} color={tokens.colors.gold} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerIcon}>{circle.icon}</Text>
            <View>
              <Text style={styles.headerTitle}>{circle.name}</Text>
              <Text style={styles.headerSubtitle}>
                {circle.memberCount} members
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerMembersButton}
            onPress={() => router.push(`/r3al/circles/${circleId}/members`)}
          >
            <Users size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {!isMember ? (
          <View style={styles.notMemberBanner}>
            <Text style={styles.notMemberText}>
              Join this circle to post and interact
            </Text>
          </View>
        ) : (
          <View style={styles.postInputContainer}>
            <TextInput
              style={styles.postInput}
              placeholder="Share something with the circle..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={postContent}
              onChangeText={setPostContent}
              multiline
              maxLength={500}
            />
            <View style={styles.postInputActions}>
              <TouchableOpacity
                style={styles.photoToggleButton}
                onPress={() => setShowPhotoInput(!showPhotoInput)}
              >
                <ImageIcon
                  size={20}
                  color={showPhotoInput ? tokens.colors.gold : tokens.colors.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.postSendButton} onPress={handlePost}>
                <Send size={20} color={tokens.colors.background} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {showPhotoInput && (
              <View>
                <TextInput
                  style={styles.photoUrlInput}
                  placeholder="Photo URL (optional)"
                  placeholderTextColor={tokens.colors.textSecondary}
                  value={photoUrl}
                  onChangeText={setPhotoUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.photoDropToggle}>
                  <TouchableOpacity
                    style={[styles.photoDropButton, photoDropMode && styles.photoDropButtonActive]}
                    onPress={() => setPhotoDropMode(!photoDropMode)}
                  >
                    <Text style={[styles.photoDropButtonText, photoDropMode && styles.photoDropButtonTextActive]}>
                      ✨ Photo Drop™ {photoDropMode ? "Enabled" : "Disabled"}
                    </Text>
                  </TouchableOpacity>
                  {photoDropMode && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.animationSelector}>
                      {["fade", "slide", "bounce", "pulse"].map((anim) => (
                        <TouchableOpacity
                          key={anim}
                          style={[
                            styles.animationChip,
                            dropAnimation === anim && styles.animationChipActive,
                          ]}
                          onPress={() => setDropAnimation(anim as any)}
                        >
                          <Text style={[
                            styles.animationChipText,
                            dropAnimation === anim && styles.animationChipTextActive,
                          ]}>
                            {anim}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        <FlatList
          data={circle.posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💬</Text>
              <Text style={styles.emptyStateText}>
                No posts yet. Be the first to share!
              </Text>
            </View>
          }
        />
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
  header: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  headerBackButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginLeft: 12,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
  headerMembersButton: {
    padding: 4,
  },
  notMemberBanner: {
    backgroundColor: tokens.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  notMemberText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
  },
  postInputContainer: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  postInput: {
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    padding: 12,
    fontSize: 14,
    color: tokens.colors.text,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  postInputActions: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoToggleButton: {
    padding: 8,
  },
  postSendButton: {
    backgroundColor: tokens.colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: tokens.dimensions.borderRadius,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  photoUrlInput: {
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    padding: 12,
    fontSize: 14,
    color: tokens.colors.text,
    marginTop: 12,
  },
  feedList: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorInfo: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  postAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  postAuthorInitial: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.background,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.text,
  },
  postTimestamp: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  postMenuButton: {
    padding: 4,
  },
  postPhoto: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: tokens.dimensions.borderRadius,
    marginBottom: 12,
    backgroundColor: tokens.colors.background,
  },
  postContent: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row" as const,
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "10",
  },
  postActionButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
  },
  postActionText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "10",
    gap: 8,
  },
  comment: {
    backgroundColor: tokens.colors.background,
    padding: 10,
    borderRadius: 6,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 13,
    color: tokens.colors.text,
    lineHeight: 18,
  },
  commentInputSection: {
    marginTop: 12,
    flexDirection: "row" as const,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    borderRadius: tokens.dimensions.borderRadius,
    padding: 10,
    fontSize: 13,
    color: tokens.colors.text,
    minHeight: 40,
  },
  commentSendButton: {
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    borderRadius: tokens.dimensions.borderRadius,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyStateIcon: {
    fontSize: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    color: tokens.colors.error,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: tokens.colors.gold,
  },
  photoDropToggle: {
    marginTop: 12,
    gap: 12,
  },
  photoDropButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    alignItems: "center" as const,
  },
  photoDropButtonActive: {
    backgroundColor: "#FFD700" + "20",
    borderColor: "#FFD700",
  },
  photoDropButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: tokens.colors.textSecondary,
  },
  photoDropButtonTextActive: {
    color: "#FFD700",
  },
  animationSelector: {
    flexDirection: "row" as const,
  },
  animationChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: tokens.colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
    marginRight: 8,
  },
  animationChipActive: {
    backgroundColor: tokens.colors.gold,
    borderColor: tokens.colors.gold,
  },
  animationChipText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
    textTransform: "capitalize" as const,
  },
  animationChipTextActive: {
    color: tokens.colors.background,
  },
  photoDropContainer: {
    position: "relative" as const,
  },
  photoDropBadge: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 215, 0, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  photoDropBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: tokens.colors.background,
  },
});
