import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Card, 
  Text, 
  Button, 
  Surface, 
  ProgressBar,
} from "react-native-paper";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Zap,
  Search,
  Bookmark,
  SlidersHorizontal
} from "lucide-react-native";
import type { JobRow } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

function scoreColor(score: number | null | undefined, colors: ReturnType<typeof useTheme>["colors"]) {
  if (score == null) return colors.sub;
  if (score >= 8) return colors.scoreHigh;
  if (score >= 5) return colors.scoreMid;
  return colors.scoreLow;
}

export default function FeedScreen() {
  const { colors, isDark } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      Alert.alert("Success", "Bot finished searching in Armenia.");
    } catch (e) {
      Alert.alert("Error", "Discovery bot failed to start.");
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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Surface style={[styles.headerSurface, { backgroundColor: colors.bg, paddingTop: Math.max(insets.top, 20) }]} elevation={0}>
        <View style={styles.headerRow}>
          <View>
             <Text variant="headlineMedium" style={{ fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>Job Feed</Text>
             <Text variant="bodyMedium" style={{ color: colors.sub, marginTop: 4 }}>Find your next venture</Text>
          </View>
          <TouchableOpacity 
             style={[styles.discoverBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
             activeOpacity={0.8}
             onPress={triggerDiscovery}
             disabled={discovering}
          >
             {discovering ? <ActivityIndicator size="small" color={colors.primary} /> : <Zap size={20} color={colors.primary} />}
          </TouchableOpacity>
        </View>

        <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
           <Search size={20} color={colors.sub} />
           <TextInput
              style={{ color: colors.text, marginLeft: 12, flex: 1, fontSize: 16, paddingVertical: 0 }}
              placeholder="Search roles or companies"
              placeholderTextColor={colors.sub}
              value={searchQuery}
              onChangeText={setSearchQuery}
           />
           <View style={{ width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 12 }} />
           <TouchableOpacity onPress={() => {/* Filter logic */}}>
              <SlidersHorizontal size={20} color={colors.primary} />
           </TouchableOpacity>
        </View>

        <ProgressBar indeterminate visible={discovering} style={{ marginTop: 20, height: 2, borderRadius: 1 }} color={colors.primary} />
      </Surface>

      <FlatList
        data={jobs.filter(j => 
            (j.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
            (j.site || "").toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.job_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 120 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 30, marginBottom: 20 }}>
               <Search size={40} color={colors.primary} strokeWidth={2} />
            </View>
            <Text variant="titleLarge" style={{ color: colors.text, fontWeight: "800" }}>
                {searchQuery ? "No results found" : "No matching jobs yet"}
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center", marginTop: 8, color: colors.sub, paddingHorizontal: 20 }}>
               {searchQuery 
                ? "Try a different search term or check your spelling."
                : "Run the AI discovery bot to automate hunting new roles exactly tailored for you."}
            </Text>
            {!searchQuery && (
                <Text style={{ textAlign: "center", color: colors.sub, fontSize: 13, marginTop: 12 }}>
                   Tap the lightning icon above to start AI Discovery.
                </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Card 
            style={[styles.jobCard, { backgroundColor: colors.card }]} 
            onPress={() => router.push({ pathname: "/job/[id]", params: { id: item.job_id } })}
            mode="elevated"
            elevation={2}
          >
            <View style={[styles.jobContent, { overflow: "hidden", borderRadius: 24 }]}>
               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                     <View style={[styles.logoBox, { backgroundColor: colors.border }]}>
                        <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>
                           {(item.site || "C").charAt(0).toUpperCase()}
                        </Text>
                     </View>
                     <View style={{ marginLeft: 12, flex: 1, paddingRight: 8 }}>
                        <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }} numberOfLines={1}>
                           {item.title || "Untitled"}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                           <Text style={{ color: colors.sub, fontSize: 13 }} numberOfLines={1}>
                              {item.site} • {item.location || "Armenia"}
                           </Text>
                        </View>
                     </View>
                  </View>
                  <Bookmark size={22} color={colors.sub} />
               </View>

               <View style={styles.tagRow}>
                  <View style={[styles.tag, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
                     <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>Full-Time</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: "rgba(160, 160, 160, 0.1)" }]}>
                     <Text style={{ color: colors.sub, fontSize: 12, fontWeight: "600" }}>{item.site || "Staff.am"}</Text>
                  </View>
                  
                  <View style={{ flex: 1 }} />
                  
                  <View style={[styles.scoreBadge, { backgroundColor: scoreColor(item.fit_score, colors) + "22" }]}>
                     <ShieldCheck size={14} color={scoreColor(item.fit_score, colors)} style={{ marginRight: 4 }} />
                     <Text style={{ fontSize: 12, fontWeight: "900", color: scoreColor(item.fit_score, colors) }}>
                        {item.fit_score != null ? `${item.fit_score}` : "?"}
                     </Text>
                  </View>
               </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerSurface: { padding: 20, paddingBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  discoverBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, borderWidth: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 20 },
  jobCard: { marginBottom: 16, borderRadius: 24, marginHorizontal: 2 },
  jobContent: { padding: 20 },
  logoBox: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  tagRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  scoreBadge: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
});
