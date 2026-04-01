import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import { Text, Surface, Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  ChevronLeft, 
  Bell, 
  User, 
  Briefcase, 
  CheckCircle2, 
  Clock,
  Sparkles
} from "lucide-react-native";
import { useTheme } from "../lib/theme";

type Notification = {
  id: string;
  type: "match" | "apply" | "system" | "profile";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFS: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "New 95% Match Found!",
    body: "Senior React Developer at SoftConstruct matches your AI profile perfectly. Apply now?",
    time: "2m ago",
    read: false
  },
  {
    id: "2",
    type: "apply",
    title: "Application Sent",
    body: "The AI agent has successfully submitted your tailored CV to Digitain.",
    time: "1h ago",
    read: true
  },
  {
    id: "3",
    type: "profile",
    title: "Profile Incomplete",
    body: "Add your LinkedIn URL to help the AI discover better matching IT roles.",
    time: "5h ago",
    read: true
  },
  {
    id: "4",
    type: "system",
    title: "Discovery Bot Finished",
    body: "A daily scan of Staff.am and Benefits.am found 12 technical roles in Armenia.",
    time: "1d ago",
    read: true
  }
];

import { Image } from "react-native";
import { useAuth } from "../lib/auth";

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();
  const { api } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/monitoring/dashboard"); // Reusing dashboard runs
        const runs = data.pipeline_runs || [];
        const mapped = runs.map((r: any) => ({
           id: String(r.id),
           type: r.stage === "discover+enrich" ? "system" : "match",
           title: r.stage === "discover+enrich" ? "Discovery Bot Finished" : "Job Scored",
           body: r.detail || "Bot completed a pipeline run.",
           time: r.created_at,
           read: true
        }));
        setNotifs(mapped);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  const getIcon = (type: string) => {
    switch(type) {
      case "match": return <Sparkles size={20} color={colors.primary} />;
      case "apply": return <CheckCircle2 size={20} color="#10b981" />;
      case "profile": return <User size={20} color="#f59e0b" />;
      default: return <Bell size={20} color={colors.sub} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Premium Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.bg }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backBtn, { backgroundColor: colors.card }]}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>Bot Activity</Text>
        <TouchableOpacity style={{ padding: 8 }}>
           <Text style={{ color: colors.primary, fontWeight: "800" }}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
             <Image 
                source={{ uri: "file:///Users/habraham1/.gemini/antigravity/brain/52e227b3-cf14-4999-b6b4-e4a81b55467a/notification_hub_empty_1775078169152.png" }}
                style={{ width: 280, height: 280, borderRadius: 40 }} 
             />
             <Text style={{ color: colors.text, fontWeight: "900", fontSize: 22, marginTop: 24, letterSpacing: -0.5 }}>All caught up!</Text>
             <Text style={{ color: colors.sub, textAlign: "center", marginTop: 8, fontSize: 15, lineHeight: 22 }}>
                No active bot signals right now. Run discovery to see new updates here.
             </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[
              styles.notifCard, 
              { 
                backgroundColor: colors.card,
                opacity: 1,
                borderColor: colors.border
              }
            ]}
          >
             <View style={[styles.iconBox, { backgroundColor: colors.bg }]}>
                {getIcon(item.type)}
             </View>
             <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                   <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.title}</Text>
                </View>
                <Text style={{ color: colors.sub, fontSize: 14, marginTop: 4, lineHeight: 20 }} numberOfLines={2}>{item.body}</Text>
                <Text style={{ color: colors.sub, fontSize: 12, marginTop: 8, fontWeight: "600" }}>{item.time.split("T")[0]}</Text>
             </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    borderBottomWidth: 0,
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", elevation: 2 },
  notifCard: { 
    flexDirection: "row", 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  empty: { alignItems: "center", marginTop: 120, paddingHorizontal: 40 }
});
