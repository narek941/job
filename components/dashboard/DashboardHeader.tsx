import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { Bell } from "lucide-react-native";

interface DashboardHeaderProps {
  userName: string;
  colors: any;
  router: any;
}

import { useI18n } from "../../lib/i18n";

export function DashboardHeader({ userName, colors, router }: DashboardHeaderProps) {
  const { t } = useI18n();
  return (
    <Surface style={[styles.headerSurface, { backgroundColor: colors.bg }]} elevation={0}>
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineSmall" style={{ fontWeight: "900", color: colors.text }}>{t("hello")} {userName.split(' ')[0]}</Text>
          <Text variant="bodyLarge" style={{ color: colors.sub, marginTop: 4 }}>{t("findNextRole")}</Text>
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
  );
}

const styles = StyleSheet.create({
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
  }
});
