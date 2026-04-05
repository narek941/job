import { useRouter } from "expo-router";
import SkeletonCard from "../../components/SkeletonCard";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Surface } from "react-native-paper";

import type { JobRow } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

// FSD / Feature Architected Components
import { FeedHeader } from "../../components/feed/FeedHeader";
import { FeedEmptyState } from "../../components/feed/FeedEmptyState";
import { FeedJobCard } from "../../components/feed/FeedJobCard";
import { useI18n } from "../../lib/i18n";

export default function FeedScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "local">("all");

  const load = useCallback(async () => {
    const { data } = await api.get<JobRow[]>("/jobs", { params: { limit: 80 } });
    setJobs(data);
  }, [api]);

  async function triggerDiscovery() {
    try {
      setDiscovering(true);
      await api.post("/search-jobs", {
        queries_en: ["Software Engineer", "Developer"], 
        staff_am: true,
        linkedin: true
      });
      await load();
      Alert.alert(t("success"), t("discoveryFinished"));
    } catch (e) {
      Alert.alert(t("error"), t("discoveryFailed"));
    } finally {
      setDiscovering(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading && jobs.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {/* Header Skeleton */}
        <Surface style={[styles.headerSurface, { backgroundColor: colors.bg, paddingTop: Math.max(insets.top, 20) }]} elevation={0}>
          <View style={styles.headerRow}>
             <View style={{ gap: 8 }}>
                 <View style={{ width: 140, height: 32, borderRadius: 8, backgroundColor: colors.card, opacity: 0.5 }} />
                 <View style={{ width: 180, height: 16, borderRadius: 4, backgroundColor: colors.card, opacity: 0.5 }} />
             </View>
             <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.card, opacity: 0.5 }} />
          </View>
          <View style={[{ height: 50, borderRadius: 16, backgroundColor: colors.card, opacity: 0.5 }]} />
          <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
             <View style={{ width: 80, height: 32, borderRadius: 12, backgroundColor: colors.card, opacity: 0.5 }} />
             <View style={{ width: 100, height: 32, borderRadius: 12, backgroundColor: colors.card, opacity: 0.5 }} />
          </View>
        </Surface>

        {/* Cards Skeleton */}
        <View style={{ padding: 16, flex: 1 }}>
           {[1, 2, 3, 4].map(idx => (
              <SkeletonCard key={idx} />
           ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FeedHeader 
         insets={insets}
         colors={colors}
         discovering={discovering}
         triggerDiscovery={triggerDiscovery}
         searchQuery={searchQuery}
         setSearchQuery={setSearchQuery}
         activeFilter={activeFilter}
         setActiveFilter={setActiveFilter}
      />

      <FlatList
        data={jobs.filter(j => {
            const matchesSearch = (j.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (j.site || "").toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            if (activeFilter === "high") return (j.fit_score ?? 0) >= 7;
            if (activeFilter === "local") return (j.location || "").toLowerCase().includes("yerevan");
            return true;
        })}
        keyExtractor={(item) => item.job_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 120 }}
        ListEmptyComponent={<FeedEmptyState colors={colors} searchQuery={searchQuery} />}
        renderItem={({ item }) => <FeedJobCard item={item} colors={colors} router={router} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerSurface: { padding: 20, paddingBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }
});
