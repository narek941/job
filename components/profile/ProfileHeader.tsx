import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { User as UserIcon, Settings } from 'lucide-react-native';

interface ProfileHeaderProps {
  fullName: string;
  roleTitle: string;
  email: string;
  colors: any;
  router: any;
}

import { useI18n } from "../../lib/i18n";

export function ProfileHeader({ fullName, roleTitle, email, colors, router }: ProfileHeaderProps) {
  const { t } = useI18n();
  return (
    <View style={{ alignItems: "center", marginTop: 24, marginBottom: 40 }}>
       <View style={styles.avatarWrapper}>
          <View style={[styles.avatarGlow, { backgroundColor: colors.primary }]} />
          <View style={[styles.avatarBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
             <UserIcon size={58} color={colors.primary} strokeWidth={2} />
          </View>
          <TouchableOpacity 
             onPress={() => router.push("/settings")} 
             activeOpacity={0.8}
             style={[styles.settingsBtnFloating, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
             <Settings size={18} color={colors.text} />
          </TouchableOpacity>
       </View>
       
       <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900", marginTop: 20, letterSpacing: -1 }}>
          {fullName || t("jobSeeker")}
       </Text>
       <View style={[styles.roleBadge, { backgroundColor: colors.primary + "15" }]}>
          <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13, textTransform: "uppercase" }}>
             {roleTitle || t("unsetRole")}
          </Text>
       </View>
       <Text style={{ color: colors.sub, fontSize: 15, marginTop: 8, opacity: 0.8 }}>{email || t("completeProfile")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: { position: "relative", width: 120, height: 120, alignItems: "center", justifyContent: "center" },
  avatarGlow: { position: "absolute", width: 130, height: 130, borderRadius: 65, opacity: 0.1 },
  avatarBox: { width: 110, height: 110, borderRadius: 36, borderWidth: 2, alignItems: "center", justifyContent: "center", elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 8 } },
  settingsBtnFloating: { position: "absolute", bottom: -4, right: -4, width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", elevation: 4 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginTop: 12 }
});
