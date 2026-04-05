import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

interface DashboardMetricsGridProps {
  stats: Record<string, any>;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function DashboardMetricsGrid({ stats, colors }: DashboardMetricsGridProps) {
  const { t } = useI18n();
  return (
    <View style={styles.metricsGrid}>
      <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.metricVal, { color: colors.text }]}>{stats.total ?? 0}</Text>
        <Text style={[styles.metricLabel, { color: colors.sub }]}>{t("discovered")}</Text>
      </View>
      <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.metricVal, { color: colors.text }]}>{stats.tailored ?? 0}</Text>
        <Text style={[styles.metricLabel, { color: colors.sub }]}>{t("aiTailored")}</Text>
      </View>
      <View style={[styles.metricBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.metricVal, { color: colors.text }]}>{stats.applied ?? 0}</Text>
        <Text style={[styles.metricLabel, { color: colors.sub }]}>{t("applied")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  metricLabel: { fontSize: 11, fontWeight: "800", marginTop: 4, textTransform: "uppercase", opacity: 0.6 }
});
