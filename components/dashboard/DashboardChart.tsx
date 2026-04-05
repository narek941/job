import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

interface DashboardChartProps {
  dailyActivity: any[];
  colors: any;
}

export function DashboardChart({ dailyActivity, colors }: DashboardChartProps) {
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  chartCard: { borderRadius: 24 }
});
