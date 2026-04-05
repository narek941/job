import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { JobRow } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

// FSD / Feature Architected Components
import { JobHeader } from "../../components/job/JobHeader";
import { JobInfo } from "../../components/job/JobInfo";
import { JobInterviewPrep } from "../../components/job/JobInterviewPrep";
import { JobResumeViewer } from "../../components/job/JobResumeViewer";
import { JobBottomBar } from "../../components/job/JobBottomBar";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = id || "";
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [job, setJob] = useState<JobRow | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [autoApply, setAutoApply] = useState(false);
  const [applyRunning, setApplyRunning] = useState(false);

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
      if (body) await api.post(endpoint, body);
      else await api.post(endpoint);
      Alert.alert("Success", successMsg);
    } catch (e: any) {
      Alert.alert("Error", String(e?.response?.data?.detail || e));
    }
  }

  async function handleApplyFlow() {
    try {
      setApplyRunning(true);
      await api.post(`/tailor-resume/${encodeURIComponent(jobId)}`);
      await api.post(`/generate-cover-letter/${encodeURIComponent(jobId)}`);
      if (autoApply) {
        await api.post(`/apply-job/${encodeURIComponent(jobId)}`, { dry_run: false, headless: true });
        Alert.alert("Success", "AI updated your CV, wrote a dynamic cover letter, and sent the application automatically! 🚀");
      } else {
        Alert.alert("Drafts Ready", "Your CV was tailored and draft message prepared. You can now apply manually to this role.");
      }
    } catch (e: any) {
       Alert.alert("Process Failed", String(e?.response?.data?.detail || e.message || e));
    } finally {
      setApplyRunning(false);
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
       <JobHeader 
          insets={insets} 
          colors={colors} 
          router={router} 
          jobId={jobId} 
          callApi={callApi} 
       />

       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 20) + 140 }}>
          <JobInfo job={job} colors={colors} />
          <JobInterviewPrep jobId={jobId} colors={colors} />
          <JobResumeViewer colors={colors} pdfUri={pdfUri} base={base} setPdfUri={setPdfUri} />
       </ScrollView>

       <JobBottomBar 
          insets={insets} 
          colors={colors} 
          autoApply={autoApply} 
          setAutoApply={setAutoApply} 
          applyRunning={applyRunning} 
          handleApplyFlow={handleApplyFlow} 
       />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
