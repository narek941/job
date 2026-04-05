import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Surface, Text, ProgressBar } from 'react-native-paper';
import { Zap, Search, SlidersHorizontal, MapPin } from 'lucide-react-native';

interface FeedHeaderProps {
  insets: any;
  colors: any;
  discovering: boolean;
  triggerDiscovery: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: "all" | "high" | "local";
  setActiveFilter: (val: "all" | "high" | "local") => void;
}

import { useI18n } from "../../lib/i18n";

export function FeedHeader({ insets, colors, discovering, triggerDiscovery, searchQuery, setSearchQuery, activeFilter, setActiveFilter }: FeedHeaderProps) {
  const { t } = useI18n();
  return (
    <Surface style={[styles.headerSurface, { backgroundColor: colors.bg, paddingTop: Math.max(insets.top, 20) }]} elevation={0}>
      <View style={styles.headerRow}>
        <View>
           <Text variant="headlineMedium" style={{ fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>{t("jobFeed")}</Text>
           <Text variant="bodyMedium" style={{ color: colors.sub, marginTop: 4 }}>{t("findNextVenture")}</Text>
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
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={colors.sub}
            value={searchQuery}
            onChangeText={setSearchQuery}
         />
         <View style={{ width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 12 }} />
         <TouchableOpacity onPress={() => Alert.alert(t("comingSoon"), t("comingSoonDesc"))}>
            <SlidersHorizontal size={20} color={colors.primary} />
         </TouchableOpacity>
      </View>
 
      <View style={styles.chipRow}>
         <TouchableOpacity 
            onPress={() => setActiveFilter("all")}
            style={[styles.chip, activeFilter === "all" ? { backgroundColor: colors.primary } : { borderWidth: 1, borderColor: colors.border }]}
         >
            <Text style={{ color: activeFilter === "all" ? "#FFF" : colors.text, fontWeight: "600", fontSize: 13 }}>{t("allJobs")}</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            onPress={() => setActiveFilter("high")}
            style={[styles.chip, activeFilter === "high" ? { backgroundColor: colors.primary } : { borderWidth: 1, borderColor: colors.border }]}
         >
            <Zap size={14} color={activeFilter === "high" ? "#FFF" : colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ color: activeFilter === "high" ? "#FFF" : colors.text, fontWeight: "600", fontSize: 13 }}>{t("highMatch")}</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            onPress={() => setActiveFilter("local")}
            style={[styles.chip, activeFilter === "local" ? { backgroundColor: colors.primary } : { borderWidth: 1, borderColor: colors.border }]}
         >
            <MapPin size={14} color={activeFilter === "local" ? "#FFF" : colors.scoreMid} style={{ marginRight: 6 }} />
            <Text style={{ color: activeFilter === "local" ? "#FFF" : colors.text, fontWeight: "600", fontSize: 13 }}>{t("inYerevan")}</Text>
         </TouchableOpacity>
      </View>

      <ProgressBar indeterminate visible={discovering} style={{ marginTop: 10, height: 2, borderRadius: 1 }} color={colors.primary} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  headerSurface: { padding: 20, paddingBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  discoverBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, borderWidth: 1 },
  chipRow: { flexDirection: "row", gap: 8, marginTop: 16, marginBottom: 4 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
});
