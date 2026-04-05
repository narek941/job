import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import { ChevronRight } from "lucide-react-native";

interface DashboardPipelineActivityProps {
  runs: any[];
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function DashboardPipelineActivity({ runs, colors }: DashboardPipelineActivityProps) {
  const { t } = useI18n();
  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("pipelineActivity")}</Text>
      </View>

      {runs.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
           <Text style={{ color: colors.sub }}>{t("noRecentActivity")}</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 20 },
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
  statusDot: { width: 10, height: 10, borderRadius: 5 }
});
