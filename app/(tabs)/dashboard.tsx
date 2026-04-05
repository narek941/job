import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

// FSD / Feature Architected Components
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardMetricsGrid } from "../../components/dashboard/DashboardMetricsGrid";
import { DashboardChart } from "../../components/dashboard/DashboardChart";
import { DashboardAutopilotSettings } from "../../components/dashboard/DashboardAutopilotSettings";
import { DashboardPipelineActivity } from "../../components/dashboard/DashboardPipelineActivity";
import { useI18n } from "../../lib/i18n";

type DashboardStats = {
  applypilot_stats: Record<string, any>;
  daily_activity?: any[];
  pipeline_runs: any[];
};

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const { t } = useI18n();
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
  const userName = profile?.personal?.full_name || t("jobSeeker");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 110 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
    >
      <DashboardHeader userName={userName} colors={colors} router={router} />
      
      <DashboardMetricsGrid stats={s} colors={colors} />
      
      <DashboardChart dailyActivity={dailyActivity} colors={colors} />
      
      <DashboardAutopilotSettings 
         autoPilot={autoPilot} 
         toggleAutopilot={toggleAutopilot} 
         colors={colors} 
      />
      
      <DashboardPipelineActivity runs={runs} colors={colors} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
