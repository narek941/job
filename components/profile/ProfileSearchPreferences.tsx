import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';

interface ProfileSearchPreferencesProps {
  targetRoles: string; setTargetRoles: (v: string) => void;
  targetLocation: string; setTargetLocation: (v: string) => void;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function ProfileSearchPreferences({ targetRoles, setTargetRoles, targetLocation, setTargetLocation, colors }: ProfileSearchPreferencesProps) {
  const themeT = { colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } };
  const { t } = useI18n();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("searchPrefs")}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label={t("targetRoles")} mode="outlined" value={targetRoles} onChangeText={setTargetRoles}
            multiline numberOfLines={2} textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("targetLocation")} mode="outlined" value={targetLocation} onChangeText={setTargetLocation}
            textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
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
