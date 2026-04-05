import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Bookmark, ShieldCheck } from 'lucide-react-native';
import type { JobRow } from '../../lib/api';

function scoreColor(score: number | null | undefined, colors: any) {
  if (score == null) return colors.sub;
  if (score >= 8) return colors.scoreHigh;
  if (score >= 5) return colors.scoreMid;
  return colors.scoreLow;
}

interface FeedJobCardProps {
  item: JobRow;
  colors: any;
  router: any;
}

export function FeedJobCard({ item, colors, router }: FeedJobCardProps) {
  return (
    <Card 
      style={[styles.jobCard, { backgroundColor: colors.card }]} 
      onPress={() => router.push({ pathname: "/job/[id]", params: { id: item.job_id } })}
      mode="elevated"
      elevation={2}
    >
      <View style={[styles.jobContent, { overflow: "hidden", borderRadius: 24 }]}>
         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
               <View style={[styles.logoBox, { backgroundColor: colors.border }]}>
                  <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>
                     {(item.site || "C").charAt(0).toUpperCase()}
                  </Text>
               </View>
               <View style={{ marginLeft: 12, flex: 1, paddingRight: 8 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }} numberOfLines={1}>
                     {item.title || "Untitled"}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                     <Text style={{ color: colors.sub, fontSize: 13 }} numberOfLines={1}>
                        {item.site} • {item.location || "Armenia"}
                     </Text>
                  </View>
               </View>
            </View>
            <Bookmark size={22} color={colors.sub} />
         </View>

         <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
               <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>Full-Time</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: "rgba(160, 160, 160, 0.1)" }]}>
               <Text style={{ color: colors.sub, fontSize: 12, fontWeight: "600" }}>{item.site || "Staff.am"}</Text>
            </View>
            
            <View style={{ flex: 1 }} />
            
            <View style={[styles.scoreBadge, { backgroundColor: scoreColor(item.fit_score, colors) + "22" }]}>
               <ShieldCheck size={14} color={scoreColor(item.fit_score, colors)} style={{ marginRight: 4 }} />
               <Text style={{ fontSize: 12, fontWeight: "900", color: scoreColor(item.fit_score, colors) }}>
                  {item.fit_score != null ? `${item.fit_score}` : "?"}
               </Text>
            </View>
         </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  jobCard: { marginBottom: 16, borderRadius: 24, marginHorizontal: 2 },
  jobContent: { padding: 20 },
  logoBox: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  tagRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  scoreBadge: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
});
