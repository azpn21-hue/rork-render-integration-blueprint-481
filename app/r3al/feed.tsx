import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { Heart, MessageCircle, Share2, MapPin, Send } from "lucide-react-native";

export default function FeedScreen() {

  const [activeTab, setActiveTab] = useState<"trending" | "local">("trending");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);

  const trendingQuery = trpc.r3al.feed.getTrending.useQuery(
    { limit: 25, offset: 0 },
    { enabled: activeTab === "trending" }
  );

  const localQuery = trpc.r3al.feed.getLocal.useQuery(
    { lat: 30.2672, lon: -97.7431, radius: 25, limit: 25 },
    { enabled: activeTab === "local" }
  );

  const createPostMutation = trpc.r3al.feed.createPost.useMutation({
    onSuccess: () => {
      setNewPostContent("");
      setShowNewPost(false);
      trendingQuery.refetch();
    },
  });

  const likePostMutation = trpc.r3al.feed.likePost.useMutation();

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPostMutation.mutate({
        content: newPostContent,
        tier: "free",
      });
    }
  };

  const handleLike = (postId: string) => {
    likePostMutation.mutate({ postId });
  };

  const posts = activeTab === "trending" ? trendingQuery.data?.posts : localQuery.data?.posts;
  const isLoading = activeTab === "trending" ? trendingQuery.isLoading : localQuery.isLoading;
  const refetch = activeTab === "trending" ? trendingQuery.refetch : localQuery.refetch;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "R3AL Feed",
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "trending" && styles.activeTab]}
          onPress={() => setActiveTab("trending")}
        >
          <Text style={[styles.tabText, activeTab === "trending" && styles.activeTabText]}>
            Trending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "local" && styles.activeTab]}
          onPress={() => setActiveTab("local")}
        >
          <Text style={[styles.tabText, activeTab === "local" && styles.activeTabText]}>
            Local
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF6B3D"
          />
        }
      >
        {showNewPost && (
          <View style={styles.newPostCard}>
            <TextInput
              style={styles.newPostInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#8E92BC"
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
              maxLength={5000}
            />
            <View style={styles.newPostActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowNewPost(false);
                  setNewPostContent("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postButton, !newPostContent.trim() && styles.postButtonDisabled]}
                onPress={handleCreatePost}
                disabled={!newPostContent.trim() || createPostMutation.isLoading}
              >
                {createPostMutation.isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send size={16} color="#FFFFFF" />
                    <Text style={styles.postButtonText}>Post</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showNewPost && (
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => setShowNewPost(true)}
          >
            <Text style={styles.createPostButtonText}>Create a post</Text>
          </TouchableOpacity>
        )}

        {isLoading && !posts && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B3D" />
            <Text style={styles.loadingText}>Loading feed...</Text>
          </View>
        )}

        {posts && posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.userAvatar || "https://i.pravatar.cc/150?img=0" }}
                style={styles.avatar}
              />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.userName}>{post.userName}</Text>
                <View style={styles.postMeta}>
                  {post.location && (
                    <View style={styles.locationBadge}>
                      <MapPin size={12} color="#8E92BC" />
                      <Text style={styles.locationText}>{post.location}</Text>
                    </View>
                  )}
                  <Text style={styles.timestamp}>
                    {new Date(post.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {post.tier && post.tier !== "free" && (
                <View style={styles.tierBadge}>
                  <Text style={styles.tierText}>{post.tier.toUpperCase()}</Text>
                </View>
              )}
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.tags && post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Heart size={20} color="#8E92BC" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#8E92BC" />
                <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color="#8E92BC" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {posts && posts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to share something!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#121212",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B3D",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#8E92BC",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  createPostButton: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderStyle: "dashed",
  },
  createPostButtonText: {
    color: "#8E92BC",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  newPostCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  newPostInput: {
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  newPostActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
  },
  cancelButtonText: {
    color: "#8E92BC",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  postButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#FF6B3D",
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  postCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1A1A",
  },
  postHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "#8E92BC",
    fontSize: 12,
  },
  timestamp: {
    color: "#8E92BC",
    fontSize: 12,
  },
  tierBadge: {
    backgroundColor: "#FF6B3D",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tierText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  postContent: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "#6C5DD3",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  postActions: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A2F4F",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "#8E92BC",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: "#8E92BC",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
    gap: 8,
  },
  emptyStateText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  emptyStateSubtext: {
    color: "#8E92BC",
    fontSize: 14,
  },
});
