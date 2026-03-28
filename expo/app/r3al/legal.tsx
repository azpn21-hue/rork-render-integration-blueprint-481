import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Shield, Copyright, AlertCircle } from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export default function LegalPage() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[tokens.colors.background, tokens.colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={tokens.colors.gold} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Legal & Trademarks</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <Shield size={48} color={tokens.colors.gold} strokeWidth={1.5} />
            <Text style={styles.heroTitle}>Intellectual Property</Text>
            <Text style={styles.heroSubtitle}>
              R3AL Technologies protects our intellectual property and respects the Privacy Act of 1974
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Copyright size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Copyright Notice</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                © 2025 R3AL Technologies. All Rights Reserved.
                {"\n\n"}
                All content, features, functionality, and design elements of the R3AL platform are owned by R3AL Technologies and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.trademark}>™</Text>
              <Text style={styles.sectionTitle}>Registered Trademarks</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.trademarkTitle}>The following are trademarks of R3AL Technologies:</Text>
              <View style={styles.trademarkList}>
                <Text style={styles.trademarkItem}>• R3AL™</Text>
                <Text style={styles.trademarkItem}>• Hive™</Text>
                <Text style={styles.trademarkItem}>• Pulse Chat™</Text>
                <Text style={styles.trademarkItem}>• Trust-Tokens™</Text>
                <Text style={styles.trademarkItem}>• Realification™</Text>
                <Text style={styles.trademarkItem}>• Optima II™</Text>
                <Text style={styles.trademarkItem}>• Question of the Day™ (QOTD™)</Text>
                <Text style={styles.trademarkItem}>• Truth Score™</Text>
                <Text style={styles.trademarkItem}>• Hive Circles™</Text>
                <Text style={styles.trademarkItem}>• Photo Drops™</Text>
              </View>
              <Text style={styles.cardFootnote}>
                All trademarks, service marks, and trade names are proprietary to R3AL Technologies and may not be used without express written permission.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Privacy Act Compliance</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                R3AL Technologies is fully compliant with the Privacy Act of 1974 (5 U.S.C. § 552a).
                {"\n\n"}
                We maintain strict standards for the collection, use, and protection of personally identifiable information (PII). All verification data is encrypted and stored securely in accordance with federal privacy regulations.
                {"\n\n"}
                Users have the right to:
                {"\n"}• Access their personal data
                {"\n"}• Request corrections to inaccurate data
                {"\n"}• Request deletion of their data (Right to be Forgotten)
                {"\n"}• Export their data in a portable format
                {"\n"}• Opt-out of non-essential data collection
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Patent Pending</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                The following innovations are patent pending:
                {"\n\n"}
                • Multi-factor biometric identity verification system
                {"\n"}• Dynamic truth scoring algorithm
                {"\n"}• Real-time honesty verification in video communications
                {"\n"}• Trust-Token blockchain integration
                {"\n"}• AI-powered integrity assessment (Optima II™)
                {"\n\n"}
                U.S. Patent Application Numbers: Pending
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Usage Guidelines</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.boldText}>Permitted Use:</Text>
                {"\n"}
                Users may access and use the R3AL platform for personal, non-commercial purposes subject to our Terms of Service.
                {"\n\n"}
                <Text style={styles.boldText}>Prohibited Use:</Text>
                {"\n"}
                • Reproduction or distribution of platform content without permission
                {"\n"}• Reverse engineering or decompilation of software
                {"\n"}• Use of trademarks or branding without authorization
                {"\n"}• Scraping or automated data collection
                {"\n"}• Impersonation or fraudulent activity
                {"\n"}• Commercial use without a license agreement
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color={tokens.colors.gold} strokeWidth={2} />
              <Text style={styles.sectionTitle}>DMCA Compliance</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                R3AL Technologies respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA).
                {"\n\n"}
                To report copyright infringement, contact:
                {"\n"}
                DMCA Agent
                {"\n"}
                R3AL Technologies
                {"\n"}
                legal@r3al.app
                {"\n\n"}
                Include: description of copyrighted work, location of infringing material, your contact information, and a statement of good faith belief.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.contactTitle}>Contact Legal Department</Text>
              <Text style={styles.contactText}>
                For questions regarding intellectual property, trademarks, licensing, or legal matters:
                {"\n\n"}
                Email: legal@r3al.app
                {"\n"}
                Subject Line: [Legal Inquiry]
                {"\n\n"}
                Response time: 3-5 business days
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Last Updated: January 3, 2025</Text>
            <Text style={styles.footerText}>Version 1.0</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: tokens.colors.surface,
    padding: 24,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 2,
    borderColor: tokens.colors.gold,
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: "center",
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  trademark: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
  },
  card: {
    backgroundColor: tokens.colors.surface,
    padding: 20,
    borderRadius: tokens.dimensions.borderRadius,
    borderWidth: 1,
    borderColor: tokens.colors.gold + "30",
  },
  cardText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: "700" as const,
    color: tokens.colors.gold,
  },
  trademarkTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    marginBottom: 16,
  },
  trademarkList: {
    gap: 8,
    marginBottom: 16,
  },
  trademarkItem: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  cardFootnote: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    fontStyle: "italic" as const,
    lineHeight: 18,
    marginTop: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: tokens.colors.gold,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gold + "30",
  },
  footerText: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
  },
});
