import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { MapPin, Newspaper, Calendar, Users } from "lucide-react-native";

export default function LocalDiscoverScreen() {
  const [activeTab, setActiveTab] = useState<"news" | "events" | "users">("news");
  const lat = 30.2672;
  const lon = -97.7431;
  const radius = 25;

  const newsQuery = trpc.r3al.location.getLocalNews.useQuery(
    { lat, lon, radius, limit: 20 },
    { enabled: activeTab === "news" }
  );

  const eventsQuery = trpc.r3al.location.getLocalEvents.useQuery(
    { lat, lon, radius, limit: 20, category: "all" },
    { enabled: activeTab === "events" }
  );

  const usersQuery = trpc.r3al.location.getNearbyUsers.useQuery(
    { lat, lon, radius: 10, limit: 20 },
    { enabled: activeTab === "users" }
  );

  const isLoading = 
    (activeTab === "news" && newsQuery.isLoading) ||
    (activeTab === "events" && eventsQuery.isLoading) ||
    (activeTab === "users" && usersQuery.isLoading);

  const refetch = 
    activeTab === "news" ? newsQuery.refetch :
    activeTab === "events" ? eventsQuery.refetch :
    usersQuery.refetch;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Local Discovery",
          headerStyle: { backgroundColor: "#0A0E27" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "news" && styles.activeTab]}
          onPress={() => setActiveTab("news")}
        >
          <Text style={[styles.tabText, activeTab === "news" && styles.activeTabText]}>
            News
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "events" && styles.activeTab]}
          onPress={() => setActiveTab("events")}
        >
          <Text style={[styles.tabText, activeTab === "events" && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#6C5DD3" />
        }
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C5DD3" />
          </View>
        )}

        {activeTab === "news" && newsQuery.data && (
          <>
            {newsQuery.data.news.map((article) => (
              <View key={article.id} style={styles.newsCard}>
                <View style={styles.cardHeader}>
                  <Newspaper size={16} color="#6C5DD3" />
                  <Text style={styles.source}>{article.source}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                </View>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.summary}>{article.summary}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.locationBadge}>
                    <MapPin size={12} color="#8E92BC" />
                    <Text style={styles.locationText}>{article.location}</Text>
                    <Text style={styles.distance}>{article.distance.toFixed(1)} mi</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "events" && eventsQuery.data && (
          <>
            {eventsQuery.data.events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.cardHeader}>
                  <Calendar size={16} color="#6C5DD3" />
                  <Text style={styles.source}>{event.category}</Text>
                </View>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.summary}>{event.description}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.locationBadge}>
                    <MapPin size={12} color="#8E92BC" />
                    <Text style={styles.locationText}>{event.location}</Text>
                  </View>
                  <Text style={styles.distance}>{event.distance.toFixed(1)} mi</Text>
                </View>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventDate}>
                    {new Date(event.startDate).toLocaleDateString()}
                  </Text>
                  <View style={styles.attendeesBadge}>
                    <Users size={12} color="#6C5DD3" />
                    <Text style={styles.attendeesText}>{event.attendees}</Text>
                  </View>
                  {event.ticketPrice === 0 ? (
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>FREE</Text>
                    </View>
                  ) : (
                    <Text style={styles.price}>${event.ticketPrice}</Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "users" && usersQuery.data && (
          <>
            {usersQuery.data.users.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userBio}>{user.bio}</Text>
                  </View>
                  <View style={styles.truthScoreBadge}>
                    <Text style={styles.truthScoreLabel}>Truth Score</Text>
                    <Text style={styles.truthScoreValue}>{user.truthScore}</Text>
                  </View>
                </View>
                <View style={styles.userFooter}>
                  <View style={styles.locationBadge}>
                    <MapPin size={12} color="#8E92BC" />
                    <Text style={styles.distance}>{user.distance.toFixed(1)} mi away</Text>
                  </View>
                  {user.commonInterests.length > 0 && (
                    <View style={styles.interestsContainer}>
                      {user.commonInterests.slice(0, 3).map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1E2139",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6C5DD3",
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
  loadingContainer: {
    alignItems: "center",
    padding: 32,
  },
  newsCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  eventCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  userCard: {
    backgroundColor: "#1E2139",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  source: {
    color: "#6C5DD3",
    fontSize: 12,
    fontWeight: "600" as const,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#2A2F4F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: "#8E92BC",
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    lineHeight: 22,
  },
  summary: {
    color: "#8E92BC",
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  distance: {
    color: "#8E92BC",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  eventDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A2F4F",
  },
  eventDate: {
    color: "#8E92BC",
    fontSize: 12,
    flex: 1,
  },
  attendeesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2A2F4F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attendeesText: {
    color: "#6C5DD3",
    fontSize: 11,
    fontWeight: "600" as const,
  },
  priceBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700" as const,
  },
  price: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  userBio: {
    color: "#8E92BC",
    fontSize: 13,
    lineHeight: 18,
  },
  truthScoreBadge: {
    backgroundColor: "#2A2F4F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    gap: 2,
  },
  truthScoreLabel: {
    color: "#8E92BC",
    fontSize: 10,
  },
  truthScoreValue: {
    color: "#6C5DD3",
    fontSize: 20,
    fontWeight: "700" as const,
  },
  userFooter: {
    gap: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  interestTag: {
    backgroundColor: "#2A2F4F",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  interestText: {
    color: "#6C5DD3",
    fontSize: 11,
    fontWeight: "600" as const,
  },
});
