import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { FileText, Zap, Upload } from 'lucide-react-native';

interface ProfileResumeCardProps {
  hasCv: boolean;
  loading: boolean;
  colors: any;
  autoFill: () => void;
  pickPdf: () => void;
}

import { useI18n } from "../../lib/i18n";

export function ProfileResumeCard({ hasCv, loading, colors, autoFill, pickPdf }: ProfileResumeCardProps) {
  const { t } = useI18n();
  return (
    <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
       <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 }}>
             <View style={[styles.iconSurface, { backgroundColor: hasCv ? "rgba(16, 185, 129, 0.15)" : "rgba(248, 113, 113, 0.15)" }]}>
                <FileText size={24} color={hasCv ? "#10b981" : "#f87171"} />
             </View>
             <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>{t("cvResume")}</Text>
                <Text style={{ color: colors.sub, marginTop: 4 }}>{hasCv ? t("pdfActive") : t("noFileUploaded")}</Text>
             </View>
          </View>
          
          <TouchableOpacity onPress={pickPdf} style={[styles.uploadBtn, { backgroundColor: colors.primary }]}>
             <Upload size={16} color="#FFF" />
             <Text style={{ color: "#FFF", fontWeight: "bold", marginLeft: 4 }}>{hasCv ? t("replace") : t("upload")}</Text>
          </TouchableOpacity>
        </View>
 
        {hasCv && (
           <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              <TouchableOpacity 
                 onPress={autoFill} 
                 disabled={loading} 
                 style={[styles.scanBtn, { backgroundColor: colors.bg, borderColor: colors.primary, borderWidth: 1, justifyContent: "center" }]}
              >
                <Zap size={18} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "bold", marginLeft: 8, fontSize: 15 }}>{t("autoFillAI")}</Text>
              </TouchableOpacity>
           </View>
        )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  iconSurface: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  uploadBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, elevation: 2 },
  scanBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 }
});
