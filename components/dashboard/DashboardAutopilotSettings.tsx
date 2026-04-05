import React from "react";
import { View, StyleSheet, Switch } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { Zap } from "lucide-react-native";

interface DashboardAutopilotSettingsProps {
  autoPilot: boolean;
  toggleAutopilot: (val: boolean) => void;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function DashboardAutopilotSettings({ autoPilot, toggleAutopilot, colors }: DashboardAutopilotSettingsProps) {
  const { t } = useI18n();
  return (
    <>
      <View style={[styles.sectionTitleRow, { marginTop: 32 }]}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("activeAutopilot")}</Text>
      </View>

      <Card style={[styles.autopilotCard, { backgroundColor: colors.card }]} mode="elevated">
        <View style={{ overflow: "hidden", borderRadius: 20 }}>
          <View style={{ flexDirection: "row", padding: 16, alignItems: "center", justifyContent: "space-between" }}>
            {/* Added flex: 1 and paddingRight here to prevent the text from pushing the Switch off-screen */}
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 16 }}>
              <View style={{ backgroundColor: autoPilot ? "rgba(59, 130, 246, 0.2)" : "rgba(160, 160, 160, 0.1)", padding: 10, borderRadius: 12 }}>
                <Zap size={24} color={autoPilot ? colors.primary : colors.sub} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>{t("autopilot")}</Text>
                <Text style={{ color: colors.sub, fontSize: 13, marginTop: 4 }} numberOfLines={1}>
                  {autoPilot ? t("tailoringActive") : t("automationPaused")}
                </Text>
              </View>
            </View>
            <Switch value={autoPilot} onValueChange={toggleAutopilot} />
          </View>
          <ProgressBar progress={autoPilot ? 1 : 0} indeterminate={autoPilot} color={colors.primary} style={{ height: 3, backgroundColor: colors.border }} />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  autopilotCard: { borderRadius: 20 }
});
