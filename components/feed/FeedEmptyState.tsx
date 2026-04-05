import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface FeedEmptyStateProps {
  colors: any;
  searchQuery: string;
}

import { useI18n } from "../../lib/i18n";

export function FeedEmptyState({ colors, searchQuery }: FeedEmptyStateProps) {
  const { t } = useI18n();
  return (
    <View style={styles.emptyContainer}>
      <Image 
          source={{ uri: "file:///Users/habraham1/.gemini/antigravity/brain/52e227b3-cf14-4999-b6b4-e4a81b55467a/empty_jobs_feed_1775078145864.png" }}
          style={{ width: 280, height: 280, borderRadius: 40 }} 
      />
      <Text variant="titleLarge" style={{ color: colors.text, fontWeight: "900", marginTop: 24, fontSize: 22, letterSpacing: -0.5 }}>
          {searchQuery ? t("feedEmptyTitleSearch") : t("feedEmptyTitleDefault")}
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: "center", marginTop: 8, color: colors.sub, paddingHorizontal: 20 }}>
         {searchQuery 
          ? t("feedEmptyDescSearch")
          : t("feedEmptyDescDefault")}
      </Text>
      {!searchQuery && (
          <Text style={{ textAlign: "center", color: colors.sub, fontSize: 13, marginTop: 12 }}>
             {t("feedEmptyHint")}
          </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 20 }
});
