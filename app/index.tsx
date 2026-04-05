import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../lib/auth";
import { useTheme } from "../lib/theme";
import { useEffect, useState } from "react";

export default function Index() {
  const { token, ready, api } = useAuth();
  const { colors } = useTheme();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    if (ready && token) {
      api.get("/profile")
        .then(res => {
          const personal = res.data?.personal || {};
          if (!personal.full_name && !personal.resume_path_original) {
            setTarget("/onboarding");
          } else {
            setTarget("/(tabs)/dashboard");
          }
        })
        .catch(() => setTarget("/login"));
    } else if (ready && !token) {
      setTarget("/login");
    }
  }, [ready, token, api]);

  if (!ready || !target) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}
