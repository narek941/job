import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';

interface ProfileBioSocialsProps {
  bio: string; setBio: (v: string) => void;
  githubUrl: string; setGithubUrl: (v: string) => void;
  linkedinUrl: string; setLinkedinUrl: (v: string) => void;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function ProfileBioSocials({ bio, setBio, githubUrl, setGithubUrl, linkedinUrl, setLinkedinUrl, colors }: ProfileBioSocialsProps) {
  const themeT = { colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } };
  const { t } = useI18n();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("bioSocials")}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label={t("shortBio")} mode="outlined" value={bio} onChangeText={setBio}
            multiline numberOfLines={4} textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("githubUrl")} mode="outlined" value={githubUrl} onChangeText={setGithubUrl}
            textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("linkedinUrl")} mode="outlined" value={linkedinUrl} onChangeText={setLinkedinUrl}
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
