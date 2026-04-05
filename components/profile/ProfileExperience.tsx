import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';

interface ProfileExperienceProps {
  skills: string; setSkills: (v: string) => void;
  experience: string; setExperience: (v: string) => void;
  education: string; setEducation: (v: string) => void;
  links: string; setLinks: (v: string) => void;
  colors: any;
}

import { useI18n } from "../../lib/i18n";

export function ProfileExperience({ skills, setSkills, experience, setExperience, education, setEducation, links, setLinks, colors }: ProfileExperienceProps) {
  const themeT = { colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } };
  const { t } = useI18n();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>{t("profExperience")}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label={t("skills")} mode="outlined" value={skills} onChangeText={setSkills}
            multiline textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("workExpSum")} mode="outlined" value={experience} onChangeText={setExperience}
            multiline numberOfLines={4} textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
           <TextInput 
            label={t("education")} mode="outlined" value={education} onChangeText={setEducation}
            multiline numberOfLines={3} textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
          />
          <TextInput 
            label={t("portfolioLinks")} mode="outlined" value={links} onChangeText={setLinks}
            multiline numberOfLines={2} textColor={colors.text} style={{ backgroundColor: colors.card }} theme={themeT}
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
