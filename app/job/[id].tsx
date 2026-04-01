import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { Text } from "react-native-paper";
import { WebView } from "react-native-webview";
import { ChevronLeft, Share2, Bookmark, MapPin, Building2, Wand2, Mail, Send, ShieldCheck, Zap } from "lucide-react-native";
import { Modal, Portal, Provider } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import type { JobRow } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id || "";
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<JobRow | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [prepMd, setPrepMd] = useState<string | null>(null);
  const [prepVisible, setPrepVisible] = useState(false);
  const [prepLoading, setPrepLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<JobRow>(`/jobs/${encodeURIComponent(jobId)}`);
        setJob(data);
      } catch {
        setJob(null);
      }
    })();
  }, [api, jobId]);

  async function callApi(endpoint: string, successMsg: string, body?: any) {
    try {
      if (body) {
        await api.post(endpoint, body);
      } else {
        await api.post(endpoint);
      }
      Alert.alert("Success", successMsg);
    } catch (e: any) {
      Alert.alert("Error", String(e?.response?.data?.detail || e));
    }
  }

  if (!job) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const base = api.defaults.baseURL || "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
       {/* Custom Header Fixed */}
       <View style={[styles.customHeader, { backgroundColor: colors.bg }]}>
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
             <TouchableOpacity style={[styles.circleBtn, { backgroundColor: colors.card }]}>
                <Bookmark size={20} color={colors.text} />
             </TouchableOpacity>
          </View>
       </View>

       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
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
             <View style={[styles.reasoningCard, { backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: colors.primary, marginTop: 32, padding: 20, borderRadius: 20, borderWidth: 1 }]}>
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

          <View style={{ marginTop: 32, backgroundColor: colors.card, padding: 16, borderRadius: 20 }}>
             <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                   <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Interview Preparation</Text>
                   <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }}>Generate AI questions and talking points</Text>
                   <TouchableOpacity 
                      onPress={async () => {
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
                      }}
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

          <View style={{ marginTop: 32 }}>
             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
               <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Resume Attachment</Text>
               <TouchableOpacity onPress={() => setPdfUri(pdfUri ? null : `${base}/files/resume.pdf`)}>
                  <Text style={{ color: colors.primary, fontWeight: "700" }}>{pdfUri ? "Hide" : "Preview"}</Text>
               </TouchableOpacity>
             </View>
             {pdfUri ? (
               <View style={{ height: 400, borderRadius: 16, overflow: "hidden" }}>
                 <WebView source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUri)}` }} style={{ flex: 1 }} />
               </View>
             ) : (
                <View style={{ padding: 16, backgroundColor: colors.card, borderRadius: 16, alignItems: "center" }}>
                   <Text style={{ color: colors.sub }}>PDF Viewer collapsed.</Text>
                </View>
             )}
          </View>
       </ScrollView>

       {/* Sticky Bottom Bar */}
       <View style={[styles.bottomBar, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
          <TouchableOpacity 
             style={[styles.applyBtn, { backgroundColor: colors.primary }]}
             activeOpacity={0.8}
             onPress={() => callApi(`/apply-job/${encodeURIComponent(jobId)}`, "Autopilot applying to job...", { dry_run: false, headless: true })}
          >
             <Send size={20} color="#FFF" style={{ marginRight: 10 }} />
             <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>Apply with AI Agent</Text>
          </TouchableOpacity>
       </View>
       <Portal>
          <Modal 
             visible={prepVisible} 
             onDismiss={() => setPrepVisible(false)} 
             contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  customHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 16,
    zIndex: 10
  },
  reasoningCard: { borderRadius: 20, padding: 20 },
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
  },
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
  bottomBar: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 44, 
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10
  },
  applyBtn: { 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
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
