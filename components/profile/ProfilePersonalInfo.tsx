import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';

interface ProfilePersonalInfoProps {
  fullName: string; setFullName: (v: string) => void;
  roleTitle: string; setRoleTitle: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  languages: string; setLanguages: (v: string) => void;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function ProfilePersonalInfo({ fullName, setFullName, roleTitle, setRoleTitle, email, setEmail, phone, setPhone, languages, setLanguages, colors }: ProfilePersonalInfoProps) {
  const themeT = { colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } };
  const { t } = useI18n();
  
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("personalInfo")}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label={t("fullName")} mode="outlined" value={fullName} onChangeText={setFullName}
            textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("profRole")} mode="outlined" value={roleTitle} onChangeText={setRoleTitle}
            textColor={colors.text} placeholder="e.g. Senior Frontend Engineer" placeholderTextColor={colors.sub}
            style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("emailAddress")} mode="outlined" value={email} onChangeText={setEmail}
            keyboardType="email-address" textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("phoneNumber")} mode="outlined" value={phone} onChangeText={setPhone}
            textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("languages")} mode="outlined" value={languages} onChangeText={setLanguages}
            multiline numberOfLines={2}
            textColor={colors.text} placeholder="e.g. Armenian (Native), English (Fluent)" placeholderTextColor={colors.sub}
            style={{ backgroundColor: colors.card }} theme={themeT}
          />
        </Card.Content>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 40, marginBottom: 16, paddingHorizontal: 4 },
  card: { borderRadius: 24, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
});
