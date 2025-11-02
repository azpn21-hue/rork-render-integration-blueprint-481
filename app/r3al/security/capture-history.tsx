import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldAlert, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

interface CaptureEvent {
  id: string;
  screen: string;
  timestamp: string;
  status: "recorded" | "appeal_pending" | "resolved" | "dismissed";
}

export default function CaptureHistory() {
  const router = useRouter();
  const { captureHistory, security } = useR3al();


  const handleAppeal = (item: CaptureEvent) => {
    router.push({
      pathname: "/r3al/security/appeal-form",
      params: { eventId: item.id, screen: item.screen, timestamp: item.timestamp }
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ShieldCheck size={64} color={tokens.colors.gold} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>No Capture Alerts</Text>
      <Text style={styles.emptyText}>
        Your content is fully protected. You&apos;ll see alerts here if someone attempts to screenshot or record your protected content.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: CaptureEvent }) => {
    const statusColor = 
      item.status === "resolved" ? tokens.colors.success :
      item.status === "dismissed" ? tokens.colors.textSecondary :
      item.status === "appeal_pending" ? tokens.colors.warning :
      tokens.colors.error;

    const statusLabel = 
      item.status === "recorded" ? "Detected" :
      item.status === "appeal_pending" ? "Under Review" :
      item.status === "resolved" ? "Resolved" :
      "Dismissed";

    return (
      <TouchableOpacity
        style={styles.alertCard}
        onPress={() => handleAppeal(item)}
        activeOpacity={0.8}
      >
        <View style={styles.alertHeader}>
          <ShieldAlert size={24} color={tokens.colors.error} strokeWidth={1.5} />
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>{item.screen.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
            <Text style={styles.alertTime}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.alertFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
          {item.status === "recorded" && (
            <TouchableOpacity
              style={styles.appealButton}
              onPress={() => handleAppeal(item)}
            >
              <Text style={styles.appealButtonText}>Appeal</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Content Capture History</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {security.captureStrikes > 0 && (
            <View style={styles.strikeCard}>
              <View style={styles.strikeHeader}>
                <Text style={styles.strikeTitle}>Security Status</Text>
                <Text style={[
                  styles.strikeCount,
                  security.captureStrikes >= 3 && styles.strikeCountDanger
                ]}>
                  {security.captureStrikes} / 3 Strikes
                </Text>
              </View>
              {security.captureStrikes >= 3 && security.restrictionUntil && (
                <Text style={styles.restrictionText}>
                  ⛔ Account restricted until {new Date(security.restrictionUntil).toLocaleString()}
                </Text>
              )}
            </View>
          )}

          <View style={styles.infoCard}>
            <AlertCircle size={20} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.infoText}>
              You&apos;ll see alerts here if someone attempted to screenshot or record your protected content. No personal data is ever stored or shared.
            </Text>
          </View>

          {captureHistory && captureHistory.length > 0 ? (
            <FlatList
              data={captureHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.list}
            />
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + '20',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + '30',
    marginTop: 16,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  list: {
    gap: 16,
    paddingBottom: 24,
  },
  alertCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.error + '40',
  },
  alertHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.text,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  alertFooter: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  appealButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: tokens.colors.gold,
    borderRadius: 8,
  },
  appealButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.background,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 24,
  },
  strikeCard: {
    backgroundColor: tokens.colors.surface,
    padding: 16,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.warning,
    marginTop: 16,
    marginBottom: 16,
  },
  strikeHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  strikeTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
  },
  strikeCount: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.warning,
  },
  strikeCountDanger: {
    color: tokens.colors.error,
  },
  restrictionText: {
    fontSize: 14,
    color: tokens.colors.error,
    marginTop: 12,
    fontWeight: "600" as const,
  },
});
