import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, RefreshControl, Switch, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Text, 
  Card, 
  Surface, 
  ProgressBar, 
} from "react-native-paper";
import { 
  Zap, 
  ChevronRight,
  Bell,
} from "lucide-react-native";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";
import { useRouter } from "expo-router";

type DashboardStats = {
  applypilot_stats: Record<string, any>;
  daily_activity?: any[];
  pipeline_runs: any[];
};

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [data, setData] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<any>({});
  const [autoPilot, setAutoPilot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const [metricsRes, prefRes, profRes] = await Promise.all([
        api.get<DashboardStats>("/monitoring/dashboard"),
        api.get("/settings/preferences"),
        api.get("/profile").catch(() => ({ data: {} }))
      ]);
      setData(metricsRes.data);
      setProfile(profRes.data);
      setAutoPilot(!!prefRes.data.auto_pilot);
    } catch (e) {
      console.warn("Dashboard fetch error", e);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleAutopilot(val: boolean) {
    try {
      setAutoPilot(val);
      await api.put("/settings/preferences", { auto_pilot: val });
    } catch (e) {
      setAutoPilot(!val);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const s = data?.applypilot_stats || {};
  const runs = data?.pipeline_runs || [];
  const dailyActivity = data?.daily_activity || [];
  const userName = profile?.personal?.full_name || "Job Seeker";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 110 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
    >
      <Surface style={[styles.headerSurface, { backgroundColor: colors.bg }]} elevation={0}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="headlineSmall" style={{ fontWeight: "900", color: colors.text }}>Hello {userName.split(' ')[0]} 👋</Text>
            <Text variant="bodyLarge" style={{ color: colors.sub, marginTop: 4 }}>Let's find your next role</Text>
          </View>
          <TouchableOpacity 
             onPress={() => router.push("/notifications")} 
             style={[styles.iconCircle, { backgroundColor: colors.card }]}
             activeOpacity={0.8}
          >
             <Bell size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </Surface>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.metricVal, { color: colors.text }]}>{s.total ?? 0}</Text>
          <Text style={[styles.metricLabel, { color: colors.sub }]}>Discovered</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.metricVal, { color: colors.text }]}>{s.tailored ?? 0}</Text>
          <Text style={[styles.metricLabel, { color: colors.sub }]}>AI Tailored</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.metricVal, { color: colors.text }]}>{s.applied ?? 0}</Text>
          <Text style={[styles.metricLabel, { color: colors.sub }]}>Applied</Text>
        </View>
      </View>

      {/* Daily Progress Chart */}
      <View style={styles.sectionTitleRow}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Weekly Growth</Text>
      </View>
      
      <Card style={[styles.chartCard, { backgroundColor: colors.card }]} mode="elevated">
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 120 }}>
            {dailyActivity.length > 0 ? dailyActivity.map((day, idx) => {
               const max = Math.max(...dailyActivity.map(d => (d.discovered || 1)));
               const h1 = ((day.discovered || 0) / max) * 100;
               const h2 = ((day.tailored || 0) / max) * 100;
               const h3 = ((day.applied || 0) / max) * 100;
               return (
                 <View key={idx} style={{ alignItems: "center", flex: 1 }}>
                   <View style={{ flexDirection: "row", alignItems: "flex-end", height: 100, gap: 2 }}>
                      <View style={{ width: 4, height: `${h1}%`, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.3 }} />
                      <View style={{ width: 4, height: `${h2}%`, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.6 }} />
                      <View style={{ width: 4, height: `${h3}%`, backgroundColor: colors.primary, borderRadius: 2 }} />
                   </View>
                   <Text style={{ color: colors.sub, fontSize: 10, marginTop: 8 }}>{day.date.split('-')[2]}</Text>
                 </View>
               );
            }) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.sub }}>Awaiting pipeline data...</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center", gap: 16 }}>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, opacity: 0.3 }} />
                <Text style={{ color: colors.sub, fontSize: 11 }}>Scanned</Text>
             </View>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, opacity: 0.6 }} />
                <Text style={{ color: colors.sub, fontSize: 11 }}>Tailored</Text>
             </View>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
                <Text style={{ color: colors.sub, fontSize: 11 }}>Applied</Text>
             </View>
          </View>
        </View>
      </Card>

      {/* Autopilot integrated natively */}
      <View style={[styles.sectionTitleRow, { marginTop: 32 }]}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Active Autopilot</Text>
      </View>

      <Card style={[styles.autopilotCard, { backgroundColor: colors.card }]} mode="elevated">
        <View style={{ overflow: "hidden", borderRadius: 20 }}>
          <View style={{ flexDirection: "row", padding: 16, alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ backgroundColor: autoPilot ? "rgba(59, 130, 246, 0.2)" : "rgba(160, 160, 160, 0.1)", padding: 10, borderRadius: 12 }}>
                <Zap size={24} color={autoPilot ? colors.primary : colors.sub} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>Autopilot</Text>
                <Text style={{ color: colors.sub, fontSize: 13, marginTop: 4 }} numberOfLines={1}>
                  {autoPilot ? "AI Discovery & Tailoring Active" : "Automation paused"}
                </Text>
              </View>
            </View>
            <Switch value={autoPilot} onValueChange={toggleAutopilot} />
          </View>
          <ProgressBar progress={autoPilot ? 1 : 0} indeterminate={autoPilot} color={colors.primary} style={{ height: 3, backgroundColor: colors.border }} />
        </View>
      </Card>

      {/* Recent Activity */}
      <View style={styles.sectionTitleRow}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Pipeline Activity</Text>
      </View>

      {runs.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
           <Text style={{ color: colors.sub }}>No recent activity logged.</Text>
        </View>
      ) : (
        runs.slice(0, 5).map((run: any, idx: number) => (
          <Surface key={idx} style={[styles.activityRow, { backgroundColor: colors.card }]}>
            <View style={[styles.statusDot, { backgroundColor: run.status === 'ok' ? '#10b981' : '#f87171' }]} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{run.stage}</Text>
              <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }}>{run.created_at.replace('T', ' ').slice(0, 16)}</Text>
            </View>
            <ChevronRight size={16} color={colors.sub} />
          </Surface>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerSurface: { paddingVertical: 16, marginBottom: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconCircle: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    alignItems: "center", 
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  metricsGrid: { flexDirection: "row", gap: 12, marginBottom: 32 },
  metricBox: { 
    flex: 1, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6
  },
  metricVal: { fontSize: 26, fontWeight: "900", letterSpacing: -1 },
  metricLabel: { fontSize: 11, fontWeight: "800", marginTop: 4, textTransform: "uppercase", opacity: 0.6 },
  chartCard: { borderRadius: 24 },
  autopilotCard: { borderRadius: 20 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  emptyBox: { padding: 40, borderRadius: 20, alignItems: "center" },
  activityRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 18, 
    borderRadius: 20, 
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
