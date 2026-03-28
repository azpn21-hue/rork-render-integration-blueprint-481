import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Shield,
  MessageCircle,
  ChevronRight,
  Trash2,
  Info,
  Award,
  Image,
  Eye,
  FileText,
  HelpCircle,
  BookOpen,
  TestTube,
  Activity,
} from "lucide-react-native";
import { useR3al } from "@/app/contexts/R3alContext";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
};

type SettingsItem = {
  id: string;
  label: string;
  type: "toggle" | "select" | "navigation" | "action";
  icon?: React.ReactNode;
  value?: any;
  options?: { label: string; value: string }[];
  onPress?: () => void;
  destructive?: boolean;
};

export default function SettingsPage() {
  const router = useRouter();
  const { userProfile, updatePrivacy, updateSettings, resetR3al, clearStrikes } = useR3al();

  const [localSettings, setLocalSettings] = useState({
    dm: userProfile?.settings?.dm || "circle_only",
    mentions: userProfile?.settings?.mentions ?? true,
    screenshotAlerts: userProfile?.settings?.alerts?.screenshots ?? true,
    endorsementAlerts: userProfile?.settings?.alerts?.new_endorsement ?? true,
    profilePrivacy: userProfile?.privacy?.profile || "circle",
    photosPrivacy: userProfile?.privacy?.photos || "circle",
    watchlistPrivacy: userProfile?.privacy?.watchlist || "public",
  });

  const handleToggle = (key: string, value: boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    
    if (key === "mentions") {
      updateSettings({ mentions: value });
    } else if (key === "screenshotAlerts" || key === "endorsementAlerts") {
      const alerts = {
        ...userProfile?.settings?.alerts,
        screenshots: key === "screenshotAlerts" ? value : localSettings.screenshotAlerts,
        new_endorsement: key === "endorsementAlerts" ? value : localSettings.endorsementAlerts,
      };
      updateSettings({ alerts });
    }
  };

  const handlePrivacyChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    
    if (key === "profilePrivacy") {
      updatePrivacy({ profile: value as "public" | "circle" | "private" });
    } else if (key === "photosPrivacy") {
      updatePrivacy({ photos: value as "public" | "circle" | "private" });
    } else if (key === "watchlistPrivacy") {
      updatePrivacy({ watchlist: value as "public" | "circle" | "private" });
    }
  };

  const handleDMChange = (value: string) => {
    setLocalSettings((prev) => ({ ...prev, dm: value }));
    updateSettings({ dm: value as "all" | "circle_only" | "none" });
  };

  const handleResetAccount = () => {
    Alert.alert(
      "Reset Account",
      "Are you sure you want to reset your account? All data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetR3al();
            router.replace("/r3al/splash");
          },
        },
      ]
    );
  };

  const handleClearStrikes = () => {
    Alert.alert(
      "Clear Security Strikes",
      "This will clear all screenshot detection strikes from your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            clearStrikes();
            Alert.alert("Success", "Security strikes cleared");
          },
        },
      ]
    );
  };

  const privacyOptions = [
    { label: "Public", value: "public" },
    { label: "Circle Only", value: "circle" },
    { label: "Private", value: "private" },
  ];

  const dmOptions = [
    { label: "Anyone", value: "all" },
    { label: "Circle Only", value: "circle_only" },
    { label: "No One", value: "none" },
  ];

  const sections: SettingsSection[] = [
    {
      id: "account",
      title: "Account",
      icon: <User size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "edit_profile",
          label: "Edit Profile",
          type: "navigation",
          icon: <User size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/r3al/profile/setup"),
        },
        {
          id: "view_profile",
          label: "View My Profile",
          type: "navigation",
          icon: <Eye size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/r3al/profile/view"),
        },
        {
          id: "verification",
          label: "Verification Status",
          type: "navigation",
          icon: <Shield size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/r3al/verification/intro"),
        },
        {
          id: "truth_score",
          label: "Truth Score Details",
          type: "navigation",
          icon: <Award size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/r3al/truth-score-detail"),
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      icon: <Lock size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "profile_privacy",
          label: "Profile Visibility",
          type: "select",
          icon: <Eye size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          value: localSettings.profilePrivacy,
          options: privacyOptions,
        },
        {
          id: "photos_privacy",
          label: "Photos Visibility",
          type: "select",
          icon: <Image size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          value: localSettings.photosPrivacy,
          options: privacyOptions,
        },
        {
          id: "watchlist_privacy",
          label: "Watchlist Visibility",
          type: "select",
          icon: <BookOpen size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          value: localSettings.watchlistPrivacy,
          options: privacyOptions,
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "mentions",
          label: "Mentions",
          type: "toggle",
          value: localSettings.mentions,
        },
        {
          id: "screenshotAlerts",
          label: "Screenshot Alerts",
          type: "toggle",
          value: localSettings.screenshotAlerts,
        },
        {
          id: "endorsementAlerts",
          label: "New Endorsements",
          type: "toggle",
          value: localSettings.endorsementAlerts,
        },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      icon: <MessageCircle size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "dm_settings",
          label: "Direct Messages From",
          type: "select",
          value: localSettings.dm,
          options: dmOptions,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: <Shield size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "capture_history",
          label: "Screenshot History",
          type: "navigation",
          onPress: () => router.push("/r3al/security/capture-history"),
        },
        {
          id: "clear_strikes",
          label: "Clear Security Strikes",
          type: "action",
          onPress: handleClearStrikes,
        },
      ],
    },
    {
      id: "developer",
      title: "Developer",
      icon: <TestTube size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "system_test",
          label: "System Test Suite",
          type: "navigation",
          icon: <Activity size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/system-test"),
        },
        {
          id: "test_features",
          label: "Test Backend Features",
          type: "navigation",
          icon: <TestTube size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/test-features"),
        },
      ],
    },
    {
      id: "about",
      title: "About",
      icon: <Info size={20} color={tokens.colors.gold} strokeWidth={2} />,
      items: [
        {
          id: "help",
          label: "Help & Support",
          type: "navigation",
          icon: <HelpCircle size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => Alert.alert("Help", "Help documentation coming soon"),
        },
        {
          id: "legal",
          label: "Legal & Trademarks",
          type: "navigation",
          icon: <FileText size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => router.push("/r3al/legal"),
        },
        {
          id: "version",
          label: "App Version",
          type: "navigation",
          icon: <Info size={18} color={tokens.colors.textSecondary} strokeWidth={2} />,
          onPress: () => Alert.alert("Version", "R3AL v1.0.0\nBuild 2025.01.03"),
        },
      ],
    },
    {
      id: "danger",
      title: "Danger Zone",
      icon: <Trash2 size={20} color={tokens.colors.error} strokeWidth={2} />,
      items: [
        {
          id: "reset_account",
          label: "Reset Account",
          type: "action",
          onPress: handleResetAccount,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (section: SettingsSection, item: SettingsItem) => {
    switch (item.type) {
      case "toggle":
        return (
          <View key={item.id} style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              {item.icon && <View style={styles.settingIcon}>{item.icon}</View>}
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={(val) => handleToggle(item.id, val)}
              trackColor={{ false: tokens.colors.textSecondary + "40", true: tokens.colors.gold }}
              thumbColor={item.value ? tokens.colors.gold : tokens.colors.surface}
            />
          </View>
        );

      case "select":
        return (
          <View key={item.id} style={styles.settingColumn}>
            <View style={styles.settingRowLeft}>
              {item.icon && <View style={styles.settingIcon}>{item.icon}</View>}
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <View style={styles.optionsRow}>
              {item.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    item.value === option.value && styles.optionChipSelected,
                  ]}
                  onPress={() => {
                    if (item.id === "profile_privacy" || item.id === "photos_privacy" || item.id === "watchlist_privacy") {
                      handlePrivacyChange(item.id.replace("_privacy", "Privacy"), option.value);
                    } else if (item.id === "dm_settings") {
                      handleDMChange(option.value);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      item.value === option.value && styles.optionChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "navigation":
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingRow}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              {item.icon && <View style={styles.settingIcon}>{item.icon}</View>}
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={20} color={tokens.colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        );

      case "action":
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingRow}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowLeft}>
              {item.icon && <View style={styles.settingIcon}>{item.icon}</View>}
              <Text style={[styles.settingLabel, item.destructive && styles.destructiveText]}>
                {item.label}
              </Text>
            </View>
            <ChevronRight
              size={20}
              color={item.destructive ? tokens.colors.error : tokens.colors.textSecondary}
              strokeWidth={2}
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={[tokens.colors.background, tokens.colors.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <User size={48} color={tokens.colors.gold} strokeWidth={2} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile?.name || "User"}</Text>
              <Text style={styles.profileBio}>{userProfile?.bio || "No bio set"}</Text>
            </View>
          </View>

          {sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                {section.icon}
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.sectionContent}>
                {section.items.map((item) => renderSettingItem(section, item))}
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>R3AL™ - Reveal • Relate • Respect</Text>
            <Text style={styles.footerSubtext}>Privacy Act of 1974 Compliant</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "30",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: tokens.colors.gold,
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: tokens.colors.text,
  },
  profileBio: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: tokens.colors.gold,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "20",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "10",
  },
  settingRowLeft: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  settingColumn: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "10",
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: tokens.colors.text,
    fontWeight: "500" as const,
  },
  destructiveText: {
    color: tokens.colors.error,
  },
  optionsRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  optionChipSelected: {
    backgroundColor: tokens.colors.gold + "20",
    borderColor: tokens.colors.gold,
  },
  optionChipText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    fontWeight: "600" as const,
  },
  optionChipTextSelected: {
    color: tokens.colors.gold,
    fontWeight: "700" as const,
  },
  footer: {
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: tokens.colors.gold,
    fontWeight: "600" as const,
  },
  footerSubtext: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
});
