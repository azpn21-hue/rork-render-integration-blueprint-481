import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, Shield, Fingerprint, FileCheck2 } from "lucide-react-native";
import { theme } from "@/app/theme";

export type TimelineItem = {
  id: string;
  label: string;
  status: "done" | "pending";
  icon: "check" | "shield" | "fingerprint" | "file";
  timestamp?: string;
};

export default function VerificationTimeline({ items }: { items: TimelineItem[] }) {
  const getIcon = (icon: TimelineItem["icon"]) => {
    switch (icon) {
      case "check":
        return <CheckCircle2 color={theme.colors.accent} size={18} />;
      case "shield":
        return <Shield color={theme.colors.sensor} size={18} />;
      case "fingerprint":
        return <Fingerprint color={theme.colors.sensor} size={18} />;
      case "file":
        return <FileCheck2 color={theme.colors.accent} size={18} />;
    }
  };

  return (
    <View style={styles.container} testID="verification-timeline">
      {items.map((item, idx) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.icon}>{getIcon(item.icon)}</View>
          <View style={styles.content}>
            <Text style={styles.label}>{item.label}</Text>
            {item.timestamp ? (
              <Text style={styles.time}>{item.timestamp}</Text>
            ) : null}
          </View>
          <View style={[styles.badge, item.status === "done" ? styles.badgeDone : styles.badgePending]}>
            <Text style={[styles.badgeText, item.status === "done" ? styles.badgeTextDone : styles.badgeTextPending]}>
              {item.status === "done" ? "VERIFIED" : "PENDING"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    width: 28,
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  label: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  time: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeDone: {
    backgroundColor: "rgba(255,200,69,0.1)",
    borderColor: "rgba(255,200,69,0.4)",
  },
  badgePending: {
    backgroundColor: "rgba(44,231,225,0.08)",
    borderColor: "rgba(44,231,225,0.3)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextDone: {
    color: theme.colors.accent,
  },
  badgeTextPending: {
    color: theme.colors.sensor,
  },
});
