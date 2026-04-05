import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../lib/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n } from "../lib/i18n";
import { useTheme, DESIGN } from "../lib/theme";

function formatApiError(e: unknown): string {
  if (typeof e === "object" && e !== null && "response" in e) {
    const data = (e as { response?: { data?: { detail?: unknown } } }).response?.data;
    const d = data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) {
      return d
        .map((x: { msg?: string; loc?: string[] }) => x?.msg || JSON.stringify(x))
        .filter(Boolean)
        .join("\n");
    }
    if (d && typeof d === "object") return JSON.stringify(d);
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();
  const router = useRouter();
  const { t, setLocale } = useI18n();
  const [email, setEmail] = useState(__DEV__ ? "test@test.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "TestPass123" : "");
  const [mode, setMode] = useState<"login" | "register">("login");

  async function submit() {
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register(email.trim(), password);
      router.replace("/(tabs)/dashboard");
    } catch (e: unknown) {
      const msg = formatApiError(e);
      const hint =
        mode === "login" && msg.toLowerCase().includes("invalid")
          ? "\n\nTip: use Create account first, or restart API with ARMAPPLY_SEED_TEST_USER=1 (see .env.test)."
          : "";
      Alert.alert("Error", (msg || "Request failed") + hint);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontWeight: DESIGN.fontHeading }]}>ArmApply</Text>
        <Text style={[styles.sub, { color: colors.sub }]}>
          AI job search for Armenia — LinkedIn, staff.am, and more.
        </Text>
      </View>
      <Text style={[styles.label, { color: colors.sub }]}>{t("email")}</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.sub}
      />
      <Text style={[styles.label, { color: colors.sub }]}>{t("password")}</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor={colors.sub}
      />
      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={submit}
      >
        <Text style={styles.buttonText}>{mode === "login" ? t("login") : t("register")}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")} style={styles.switch}>
        <Text style={{ color: colors.primary }}>{mode === "login" ? t("register") : t("login")}</Text>
      </Pressable>
      <View style={styles.langRow}>
        <Pressable onPress={() => setLocale("en")}>
          <Text style={{ color: colors.sub }}>English</Text>
        </Pressable>
        <Text style={{ color: colors.border }}> | </Text>
        <Pressable onPress={() => setLocale("hy")}>
          <Text style={{ color: colors.sub }}>Հայերեն</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 40, fontWeight: "900", letterSpacing: -1 },
  sub: { marginTop: 12, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  label: { fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: { borderRadius: DESIGN.radiusBtn, padding: 18, marginBottom: 20, fontSize: 16 },
  button: { padding: 18, borderRadius: DESIGN.radiusBtn, alignItems: "center", marginTop: 10, elevation: 4 },
  buttonText: { color: "#ffffff", fontWeight: "800", fontSize: 16, textTransform: 'uppercase' },
  switch: { alignItems: "center", marginTop: 30 },
  langRow: { flexDirection: "row", justifyContent: "center", marginTop: 40, gap: 12 },
});
