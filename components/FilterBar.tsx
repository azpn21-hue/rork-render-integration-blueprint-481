import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { 
  Filter, 
  Star, 
  TrendingUp, 
  Award, 
  Hexagon,
  MessageCircle,
  Heart,
  Sparkles,
  Shield,
  Target
} from "lucide-react-native";
import tokens from "@/schemas/r3al/theme/ui_tokens.json";

export type FilterOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

export type FilterBarProps = {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  testID?: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: "all",
    label: "All",
    icon: <Filter size={20} color={tokens.colors.gold} strokeWidth={2} />,
    color: tokens.colors.gold,
  },
  {
    id: "circles",
    label: "Circles",
    icon: <Hexagon size={20} color="#00FF66" strokeWidth={2} />,
    color: "#00FF66",
  },
  {
    id: "verified",
    label: "Verified",
    icon: <Shield size={20} color="#3B82F6" strokeWidth={2} />,
    color: "#3B82F6",
  },
  {
    id: "trending",
    label: "Trending",
    icon: <TrendingUp size={20} color="#F59E0B" strokeWidth={2} />,
    color: "#F59E0B",
  },
  {
    id: "top_score",
    label: "Top Score",
    icon: <Award size={20} color={tokens.colors.gold} strokeWidth={2} />,
    color: tokens.colors.gold,
  },
  {
    id: "active",
    label: "Active",
    icon: <Sparkles size={20} color="#A855F7" strokeWidth={2} />,
    color: "#A855F7",
  },
  {
    id: "mentors",
    label: "Mentors",
    icon: <Target size={20} color="#10B981" strokeWidth={2} />,
    color: "#10B981",
  },
  {
    id: "new_members",
    label: "New",
    icon: <Star size={20} color="#EC4899" strokeWidth={2} />,
    color: "#EC4899",
  },
  {
    id: "pulse_active",
    label: "Pulse Active",
    icon: <Heart size={20} color="#EF4444" strokeWidth={2} />,
    color: "#EF4444",
  },
  {
    id: "discussions",
    label: "Discussion",
    icon: <MessageCircle size={20} color="#8B5CF6" strokeWidth={2} />,
    color: "#8B5CF6",
  },
];

export default function FilterBar({ selectedFilters, onFilterChange, testID }: FilterBarProps) {
  const toggleFilter = (filterId: string) => {
    if (filterId === "all") {
      onFilterChange(["all"]);
      return;
    }

    let newFilters: string[];
    if (selectedFilters.includes(filterId)) {
      newFilters = selectedFilters.filter((f) => f !== filterId);
      if (newFilters.length === 0) {
        newFilters = ["all"];
      }
    } else {
      newFilters = selectedFilters.filter((f) => f !== "all");
      newFilters.push(filterId);
    }

    onFilterChange(newFilters);
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.headerRow}>
        <Filter size={18} color={tokens.colors.gold} strokeWidth={2} />
        <Text style={styles.title}>Filter by</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedFilters.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipSelected,
                isSelected && { borderColor: option.color },
              ]}
              onPress={() => toggleFilter(option.id)}
              activeOpacity={0.7}
              testID={`filter-${option.id}`}
            >
              {option.icon}
              <Text
                style={[
                  styles.filterLabel,
                  isSelected && styles.filterLabelSelected,
                  isSelected && { color: option.color },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gold + "20",
  },
  headerRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.gold,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: tokens.colors.background,
    borderWidth: 2,
    borderColor: tokens.colors.gold + "30",
  },
  filterChipSelected: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: tokens.colors.textSecondary,
  },
  filterLabelSelected: {
    fontWeight: "700" as const,
  },
});
