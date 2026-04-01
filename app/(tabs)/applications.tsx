import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Surface } from "react-native-paper";
import { CheckCircle2, CircleDashed, Clock, ChevronRight } from "lucide-react-native";
import type { JobRow } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

type FilterTab = "All" | "Applied" | "In Progress";

export default function ApplicationsScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const insets = useSafeAreaInsets();
  const [rows, setRows] = useState<JobRow[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data } = await api.get<JobRow[]>("/jobs", { params: { limit: 200 } });
    setRows(data.filter((j) => j.applied_at || j.apply_status));
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const filteredRows = rows.filter(r => {
    if (activeTab === "All") return true;
    if (activeTab === "Applied" && r.apply_status === "applied") return true;
    if (activeTab === "In Progress" && r.apply_status === "in-progress") return true;
    return false;
  });

  const tabs: FilterTab[] = ["All", "Applied", "In Progress"];

  const getStatusIcon = (status: string) => {
    if (status === 'applied') return <CheckCircle2 size={24} color="#10b981" />;
    if (status === 'in-progress') return <Clock size={24} color={colors.primary} />;
    return <CircleDashed size={24} color={colors.sub} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Surface style={[styles.headerSurface, { backgroundColor: colors.bg, paddingTop: Math.max(insets.top, 20) }]} elevation={0}>
        <View style={styles.headerRow}>
          <View>
             <Text variant="headlineMedium" style={{ fontWeight: "900", color: colors.text, letterSpacing: -1 }}>Your Pipeline</Text>
             <Text style={{ color: colors.sub, marginTop: 4, opacity: 0.8 }}>Tracker for active job applications</Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
          {tabs.map(tab => {
            const isActive = tab === activeTab;
            return (
              <Pressable
                key={tab}
                style={[
                  styles.pill,
                  { backgroundColor: isActive ? colors.primary : colors.card }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={{ color: isActive ? '#fff' : colors.sub, fontWeight: '600' }}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Surface>

      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: insets.bottom + 100 }}
        data={filteredRows}
        keyExtractor={(item) => item.job_id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
             <Clock size={48} color={colors.sub} strokeWidth={1} style={{ marginBottom: 16 }} />
             <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 18 }}>No Applications</Text>
             <Text style={{ color: colors.sub, textAlign: "center", marginTop: 8, paddingHorizontal: 20 }}>
                You haven't tracked any applications in this filter.
             </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.trackCard, { backgroundColor: colors.card }]}>
             <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                   {getStatusIcon(item.apply_status || "pending")}
                   <View style={{ marginLeft: 16 }}>
                      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }} numberOfLines={1}>{item.title}</Text>
                      <Text style={{ color: colors.sub, fontSize: 13, marginTop: 4 }}>{item.site || "Staff.am"} • {item.applied_at?.slice(0, 10) || "Processing"}</Text>
                   </View>
                </View>
                <ChevronRight size={20} color={colors.sub} />
             </View>
             
             {/* Divider Line */}
             <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />
             
             {/* Timeline Steps Mock (WorkScout stylistic) */}
             <View style={styles.stepperContainer}>
                <View style={styles.step}>
                   <View style={[styles.dot, { backgroundColor: "#10b981" }]} />
                   <Text style={[styles.stepText, { color: colors.text }]}>Discovered</Text>
                </View>
                <View style={[styles.stepLine, { backgroundColor: (item.apply_status === 'applied' || item.apply_status === 'tailored') ? "#10b981" : colors.border }]} />
                <View style={styles.step}>
                   <View style={[styles.dot, { backgroundColor: (item.apply_status === 'applied' || item.apply_status === 'tailored') ? "#10b981" : colors.border }]} />
                   <Text style={[styles.stepText, { color: (item.apply_status === 'applied' || item.apply_status === 'tailored') ? colors.text : colors.sub }]}>Tailored</Text>
                </View>
                <View style={[styles.stepLine, { backgroundColor: item.apply_status === 'applied' ? "#10b981" : colors.border }]} />
                <View style={styles.step}>
                   <View style={[styles.dot, { backgroundColor: item.apply_status === 'applied' ? "#10b981" : colors.border }]} />
                   <Text style={[styles.stepText, { color: item.apply_status === 'applied' ? colors.text : colors.sub }]}>Applied</Text>
                </View>
             </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerSurface: { padding: 20, paddingBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  trackCard: { 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 20, 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 } 
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepperContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, paddingHorizontal: 10 },
  step: { alignItems: "center" },
  dot: { width: 14, height: 14, borderRadius: 7, marginBottom: 10, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)" },
  stepLine: { flex: 1, height: 2, marginHorizontal: -4, marginBottom: 24, borderRadius: 1 },
  stepText: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.2 }
});
