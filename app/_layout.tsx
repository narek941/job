import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider, useTheme } from "../lib/theme";
import { I18nProvider } from "../lib/i18n";

import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";

function Shell() {
  const { isDark, colors } = useTheme();
  
  const paperTheme = isDark 
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: colors.primary, background: colors.bg } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: colors.primary, background: colors.bg } };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="notifications" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
