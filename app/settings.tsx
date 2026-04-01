import { useState } from "react";
import { Alert, StyleSheet, Switch, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button, Card, Surface, Divider } from "react-native-paper";
import { useAuth } from "../lib/auth";
import { setLocale } from "../lib/i18n";
import { useTheme } from "../lib/theme";
import { 
  Globe, 
  Moon, 
  Sun, 
  Monitor, 
  Zap, 
  MessageCircle, 
  ShieldAlert, 
  LogOut,
  ChevronLeft
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { colors, isDark, setPreference, preference } = useTheme();
  const { api, logout } = useAuth();
  const router = useRouter();
  
  const [queries, setQueries] = useState("software engineer, developer");
  const [telegram, setTelegram] = useState("");

  const [alwaysDry, setAlwaysDry] = useState(true);
  const [resumeLang, setResumeLang] = useState("bilingual");
  const [coverLang, setCoverLang] = useState("bilingual");
  const [autoPilot, setAutoPilot] = useState(false);

  // Load preferences correctly on mount
  useState(() => {
    (async () => {
       try {
          const res = await api.get("/settings/preferences");
          if (res.data) {
             setAlwaysDry(res.data.always_dry_run ?? true);
             setResumeLang(res.data.resume_language ?? "bilingual");
             setCoverLang(res.data.cover_letter_language ?? "bilingual");
             setAutoPilot(res.data.auto_pilot ?? false);
          }
       } catch(e){}
    })();
  });

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);

  async function runSearch() {
    try {
      setLoadingSearch(true);
      const en = queries.split(",").map((s) => s.trim()).filter(Boolean);
      const { data } = await api.post("/search-jobs", {
        queries_en: en,
        queries_hy: [],
        linkedin: true,
        staff_am: true,
        indeed: false,
        workers: 1,
      });
      Alert.alert("Search started", JSON.stringify(data?.result ?? data).slice(0, 400));
    } catch (e: unknown) {
      Alert.alert("Error", String((e as any)?.response?.data?.detail || e));
    } finally {
      setLoadingSearch(false);
    }
  }

  async function runScore() {
    try {
      setLoadingScore(true);
      const { data } = await api.post("/score-jobs", { limit: 0 });
      Alert.alert("Scoring", JSON.stringify(data?.result ?? data).slice(0, 400));
    } catch (e: unknown) {
      Alert.alert("Error", String((e as any)?.response?.data?.detail || e));
    } finally {
      setLoadingScore(false);
    }
  }

  async function saveTelegram() {
    try {
      await api.post("/settings/telegram", { chat_id: telegram.trim() || null });
      Alert.alert("Saved", "Telegram chat id updated.");
    } catch (e: unknown) {
      Alert.alert("Error", String((e as any)?.response?.data?.detail || e));
    }
  }

  async function savePrefs(newAlwaysDry: boolean, newResumeLang: string, newCoverLang: string, newAutoPilot: boolean) {
    await api.put("/settings/preferences", {
      always_dry_run: newAlwaysDry,
      resume_language: newResumeLang,
      cover_letter_language: newCoverLang,
      auto_pilot: newAutoPilot,
    });
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={[styles.wrap, { backgroundColor: colors.bg }]} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text variant="headlineMedium" style={{ fontWeight: "900", color: colors.text, marginLeft: 16 }}>Settings</Text>
        </View>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                  {preference === "system" ? <Monitor size={20} color="#3b82f6" /> : (isDark ? <Moon size={20} color="#3b82f6" /> : <Sun size={20} color="#3b82f6" />)}
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold" }}>Theme Preference</Text>
                  <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>Currently {preference}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setPreference(isDark ? "light" : "dark")} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 12 }}>Toggle</Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                  <Globe size={20} color="#10b981" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold" }}>Language (UI)</Text>
                  <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>English / Հայերեն</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity onPress={() => setLocale("en")} style={[styles.actionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
                  <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12 }}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLocale("hy")} style={[styles.actionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
                  <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12 }}>HY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>Pipeline & Automation</Text>
        <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
          <Card.Content>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
                <Zap size={20} color="#8b5cf6" />
              </View>
              <Text style={{ color: colors.text, fontWeight: "bold", marginLeft: 12 }}>Manual Triggers</Text>
            </View>
            
            <TextInput
              label="Keywords (comma-separated)"
              mode="outlined"
              value={queries}
              onChangeText={setQueries}
              textColor={colors.text}
              style={{ backgroundColor: colors.bg, marginTop: 16 }}
              theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
            />
            
            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              <Button 
                mode="contained" 
                onPress={runSearch} 
                buttonColor={colors.primary} 
                loading={loadingSearch}
                style={{ flex: 1, borderRadius: 12 }}
              >
                Discover Jobs
              </Button>
              <Button 
                mode="outlined" 
                onPress={runScore} 
                textColor={colors.text}
                loading={loadingScore}
                style={{ flex: 1, borderRadius: 12, borderColor: colors.border }}
              >
                Score Match
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
          <Card.Content>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(56, 189, 248, 0.15)" }]}>
                <MessageCircle size={20} color="#38bdf8" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Telegram Bot</Text>
                <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>Get alerts for new job matches via @userinfobot</Text>
              </View>
            </View>

            <TextInput
              label="Chat ID"
              mode="outlined"
              value={telegram}
              onChangeText={setTelegram}
              textColor={colors.text}
              keyboardType="numeric"
              style={{ backgroundColor: colors.bg, marginTop: 16 }}
              theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
            />
            
            <Button 
              mode="contained" 
              onPress={saveTelegram} 
              buttonColor={colors.primary} 
              style={{ marginTop: 16, borderRadius: 12 }}
            >
              Save Telegram ID
            </Button>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>Safety & AI Settings</Text>
        <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(244, 63, 94, 0.15)" }]}>
                  <ShieldAlert size={20} color="#f43f5e" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold" }}>Always Dry-Run</Text>
                  <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>Never apply automatically</Text>
                </View>
              </View>
              <Switch value={alwaysDry} onValueChange={(v) => { setAlwaysDry(v); savePrefs(v, resumeLang, coverLang, autoPilot); }} trackColor={{ false: colors.border, true: colors.primary }} />
            </View>

            <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
                  <Zap size={20} color="#8b5cf6" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold" }}>Daily Autopilot Bot</Text>
                  <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>Run pipeline automatically</Text>
                </View>
              </View>
              <Switch value={autoPilot} onValueChange={(v) => { setAutoPilot(v); savePrefs(alwaysDry, resumeLang, coverLang, v); }} trackColor={{ false: colors.border, true: colors.primary }} />
            </View>

            <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />
            
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Resume / Cover Language</Text>
                <Text style={{ color: colors.sub, fontSize: 13, marginTop: 2 }}>Generate in both EN / HY</Text>
              </View>
              <TouchableOpacity 
                onPress={() => { setResumeLang("bilingual"); setCoverLang("bilingual"); savePrefs(alwaysDry, "bilingual", "bilingual", autoPilot); }}
                style={[styles.actionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12 }}>{resumeLang === "bilingual" ? "Bilingual" : "Set Bilingual"}</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <TouchableOpacity onPress={() => logout()} style={[styles.logoutBtn, { borderColor: colors.scoreLow, backgroundColor: colors.scoreLow + "15" }]}>
          <LogOut size={20} color={colors.scoreLow} />
          <Text style={{ color: colors.scoreLow, fontWeight: "800", marginLeft: 8, fontSize: 16 }}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, marginTop: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontWeight: "800", marginBottom: 12, marginTop: 24, paddingHorizontal: 4 },
  card: { borderRadius: 20 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutBtn: { marginTop: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 16, borderWidth: 1 }
});
