import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
import { Zap, ShieldCheck } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { useAuth } from '../../lib/auth';

interface JobInterviewPrepProps {
  jobId: string;
  colors: any;
}

export function JobInterviewPrep({ jobId, colors }: JobInterviewPrepProps) {
  const { api } = useAuth();
  const [prepMd, setPrepMd] = useState<string | null>(null);
  const [prepVisible, setPrepVisible] = useState(false);
  const [prepLoading, setPrepLoading] = useState(false);

  const fetchPrep = async () => {
    try {
      setPrepLoading(true);
      const { data } = await api.post(`/interview/prep/${encodeURIComponent(jobId)}`);
      setPrepMd(data.prep_markdown);
      setPrepVisible(true);
    } catch (e) {
      Alert.alert("Error", "Could not generate prep material.");
    } finally {
      setPrepLoading(false);
    }
  };

  return (
    <>
      <View style={{ marginTop: 32, backgroundColor: colors.card, padding: 16, borderRadius: 20 }}>
         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
               <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Interview Preparation</Text>
               <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }}>Generate AI questions and talking points</Text>
               <TouchableOpacity 
                  onPress={fetchPrep}
                  style={[styles.smallActionBtn, { backgroundColor: colors.primary + "15", marginTop: 12 }]}
               >
                  <Zap size={16} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: "800", marginLeft: 6 }}>{prepLoading ? "Preparing..." : "Coach me for this role"}</Text>
               </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", padding: 8, borderRadius: 10, marginLeft: 16 }}>
               <ShieldCheck size={20} color={colors.primary} />
            </View>
         </View>
      </View>
      <Portal>
         <Modal 
            visible={prepVisible} 
            onDismiss={() => setPrepVisible(false)} 
            contentContainerStyle={[{ backgroundColor: colors.card }, styles.modal]}
         >
            <ScrollView>
               <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", marginBottom: 20 }}>Interview Prep</Text>
               <Markdown style={{ 
                  body: { color: colors.text, fontSize: 16, lineHeight: 24 }, 
                  heading2: { color: colors.primary, marginTop: 20, fontWeight: "800", fontSize: 18 } 
               }}>
                  {prepMd || ""}
               </Markdown>
            </ScrollView>
            <TouchableOpacity onPress={() => setPrepVisible(false)} style={[styles.closeBtn, { backgroundColor: colors.primary }]}>
               <Text style={{ color: "#FFF", fontWeight: "800" }}>Got it</Text>
            </TouchableOpacity>
         </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  smallActionBtn: {
     flexDirection: "row",
     alignItems: "center",
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 10,
     alignSelf: "flex-start"
  },
  modal: {
     margin: 20,
     padding: 24,
     borderRadius: 32,
     height: "80%"
  },
  closeBtn: {
     marginTop: 20,
     paddingVertical: 14,
     borderRadius: 16,
     alignItems: "center"
  }
});
