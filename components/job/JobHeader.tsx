import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { ChevronLeft, Wand2, Mail, Bookmark } from 'lucide-react-native';

interface JobHeaderProps {
  insets: { top: number };
  colors: any;
  router: any;
  jobId: string;
  callApi: (endpoint: string, successMsg: string, body?: any) => Promise<void>;
}

export function JobHeader({ insets, colors, router, jobId, callApi }: JobHeaderProps) {
  return (
    <View style={[{ 
      flexDirection: "row", 
      justifyContent: "space-between", 
      alignItems: "center", 
      paddingHorizontal: 20, 
      paddingBottom: 16,
      zIndex: 10,
      backgroundColor: colors.bg, 
      paddingTop: Math.max(insets.top, 20) 
    }]}>
      <TouchableOpacity onPress={() => router.back()} style={[styles.circleBtn, { backgroundColor: colors.card }]}>
         <ChevronLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>Details</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
         <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.circleBtn, { backgroundColor: colors.card }]}
            onPress={() => callApi(`/tailor-resume/${encodeURIComponent(jobId)}`, "Resume tailored!")}
         >
            <Wand2 size={20} color={colors.primary} />
         </TouchableOpacity>
         <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.circleBtn, { backgroundColor: colors.card }]}
            onPress={() => callApi(`/generate-cover-letter/${encodeURIComponent(jobId)}`, "Cover letter generated.")}
         >
            <Mail size={20} color={colors.primary} />
         </TouchableOpacity>
         <TouchableOpacity 
            style={[styles.circleBtn, { backgroundColor: colors.card }]}
            onPress={() => Alert.alert("Saved", "Job added to your saved bookmarks.")}
         >
            <Bookmark size={20} color={colors.text} />
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
});
