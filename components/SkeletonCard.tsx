import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { useTheme } from "../lib/theme";

export default function SkeletonCard() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated" elevation={2}>
      <Animated.View style={[styles.content, { opacity }]}>
        <View style={styles.topRow}>
          <View style={[styles.logo, { backgroundColor: colors.border }]} />
          <View style={styles.textStack}>
            <View style={[styles.titleLine, { backgroundColor: colors.border }]} />
            <View style={[styles.subtitleLine, { backgroundColor: colors.border }]} />
          </View>
        </View>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: colors.border }]} />
          <View style={[styles.tagShort, { backgroundColor: colors.border }]} />
          <View style={{ flex: 1 }} />
          <View style={[styles.scoreTag, { backgroundColor: colors.border }]} />
        </View>
      </Animated.View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 24,
    marginHorizontal: 2,
  },
  content: {
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  textStack: {
    marginLeft: 12,
    flex: 1,
    paddingTop: 4,
    gap: 10,
  },
  titleLine: {
    height: 18,
    borderRadius: 9,
    width: "80%",
  },
  subtitleLine: {
    height: 14,
    borderRadius: 7,
    width: "50%",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  tag: {
    height: 28,
    width: 80,
    borderRadius: 10,
  },
  tagShort: {
    height: 28,
    width: 60,
    borderRadius: 10,
  },
  scoreTag: {
    height: 28,
    width: 48,
    borderRadius: 10,
  },
});
