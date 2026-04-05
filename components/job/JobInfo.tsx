import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MapPin, Building2 } from 'lucide-react-native';
import type { JobRow } from '../../lib/api';

interface JobInfoProps {
  job: JobRow;
  colors: any;
}

export function JobInfo({ job, colors }: JobInfoProps) {
  return (
    <>
      {/* Logo & Title */}
      <View style={{ alignItems: "center", marginTop: 24 }}>
         <View style={[styles.largeLogo, { backgroundColor: colors.card }]}>
            <Text style={{ fontSize: 32, fontWeight: "900", color: colors.text }}>
               {job.site ? job.site.charAt(0).toUpperCase() : "C"}
            </Text>
         </View>
         <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, marginTop: 16, textAlign: "center" }}>
            {job.title}
         </Text>
         <Text style={{ color: colors.sub, fontSize: 16, marginTop: 8 }}>
            {job.site} • {job.location || "Armenia"}
         </Text>
      </View>

      {/* Tags */}
      <View style={styles.tagWrap}>
         <View style={[styles.pill, { backgroundColor: colors.card }]}>
            <Building2 size={16} color={colors.sub} />
            <Text style={{ color: colors.sub, marginLeft: 6, fontWeight: "600" }}>Full-Time</Text>
         </View>
         <View style={[styles.pill, { backgroundColor: colors.card }]}>
            <MapPin size={16} color={colors.sub} />
            <Text style={{ color: colors.sub, marginLeft: 6, fontWeight: "600" }}>On-Site</Text>
         </View>
         {job.fit_score != null && (
            <View style={[styles.pill, { backgroundColor: colors.card }]}>
               <Text style={{ color: colors.primary, fontWeight: "800" }}>{job.fit_score}/10 Fit</Text>
            </View>
         )}
      </View>

      {/* Automated Intelligence */}
      {job.score_reasoning ? (
         <View style={[styles.reasoningCard, { backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: colors.primary, marginTop: 32 }]}>
           <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 18, marginBottom: 8 }}>✨ AI Agent Match Analysis</Text>
           <Text style={{ color: colors.text, fontSize: 15, lineHeight: 24 }}>{job.score_reasoning}</Text>
         </View>
      ) : null}

      <View style={{ marginTop: 32 }}>
         <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>About the Job</Text>
         <Text style={{ color: colors.sub, marginTop: 12, fontSize: 16, lineHeight: 26 }}>
            {job.full_description || "No description provided."}
         </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  largeLogo: { 
    width: 90, 
    height: 90, 
    borderRadius: 24, 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 24 },
  pill: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  reasoningCard: { borderRadius: 20, padding: 20, borderWidth: 1 }
});
