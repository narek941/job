import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Upload, ChevronRight, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/auth";
import { useTheme } from "../lib/theme";

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  async function pickPdfAndContinue() {
    const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (res.canceled || !res.assets?.[0]) return;
    const file = res.assets[0];
    const form = new FormData();
    // @ts-ignore
    form.append("file", { uri: file.uri, name: file.name || "resume.pdf", type: "application/pdf" });
    
    try {
      setLoading(true);
      await api.post("/profile/resume-pdf", form, { headers: { "Content-Type": "multipart/form-data" } });
      await api.post("/profile/auto-fill-from-resume");
      
      router.replace("/(tabs)/dashboard");
    } catch (e: any) {
      Alert.alert("Error", String(e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  function skip() {
      router.replace("/(tabs)/profile");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={{ flex: 1, padding: 30, justifyContent: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: "900", color: colors.text, marginBottom: 16 }}>Welcome to ArmApply!</Text>
        <Text style={{ fontSize: 18, color: colors.sub, lineHeight: 28, marginBottom: 40 }}>
          Let's build your AI Profile so we can automatically find and apply to the best IT jobs in Armenia for you.
        </Text>
        
        <TouchableOpacity 
           onPress={pickPdfAndContinue} 
           disabled={loading}
           style={[styles.mainBtn, { backgroundColor: colors.primary }]}
        >
           {loading ? <ActivityIndicator color="#fff" /> : (
             <>
                <Zap size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "800", marginLeft: 12 }}>Upload PDF CV (AI Parse)</Text>
             </>
           )}
        </TouchableOpacity>

        <TouchableOpacity 
           onPress={skip} 
           disabled={loading}
           style={[styles.skipBtn, { borderColor: colors.border }]}
        >
           <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Fill data manually</Text>
           <ChevronRight size={18} color={colors.sub} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, borderRadius: 16, elevation: 4 },
  skipBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, borderRadius: 16, borderWidth: 1, marginTop: 16 }
});
