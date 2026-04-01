import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  TextInput, 
  Button, 
  Text, 
  Card, 
  Avatar, 
  Surface, 
} from "react-native-paper";
import { Upload, ChevronRight, FileText, User as UserIcon, Settings, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Personal Info
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  
  // Professional Info
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [links, setLinks] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [languages, setLanguages] = useState("");
  
  // Search Preferences
  const [targetRoles, setTargetRoles] = useState("");
  const [targetLocation, setTargetLocation] = useState("Armenia");
  
  const [hasCv, setHasCv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prof, pref] = await Promise.all([
          api.get("/profile").catch(() => ({ data: {} })),
          api.get("/settings/preferences")
        ]);
        const p = prof.data?.personal || {};
        // Use functional updates so we don't trigger the auto-save effect on initial load
        setFullName(p.full_name || "");
        setRoleTitle(p.role_title || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setBio(p.bio || "");
        setSkills(p.skills || "");
        setExperience(p.work_experience_text || "");
        setEducation(p.education_text || "");
        setLinks(p.links_text || "");
        setGithubUrl(p.github_url || "");
        setLinkedinUrl(p.linkedin_url || "");
        setLanguages(p.languages || "");

        if (pref.data?.target_roles) setTargetRoles(pref.data.target_roles.join(", "));
        if (pref.data?.target_location) setTargetLocation(pref.data.target_location);
        setHasCv(!!p.resume_path_original);
      } catch (e) {
        console.warn("Could not fetch profile");
      } finally {
        setFetching(false);
      }
    })();
  }, [api]);

  // Debounced auto-save
  useEffect(() => {
    if (fetching) return; // Don't save during initial load
    const timer = setTimeout(() => {
      saveAll();
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    fullName, roleTitle, email, phone, bio, 
    skills, experience, education, links, 
    githubUrl, linkedinUrl, languages,
    targetRoles, targetLocation
  ]);

  async function saveAll() {
    try {
      setLoading(true);
      const profileBody = {
        personal: {
          full_name: fullName,
          role_title: roleTitle,
          email,
          phone,
          bio,
          skills,
          work_experience_text: experience,
          education_text: education,
          links_text: links,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          languages
        }
      };
      await api.put("/profile", profileBody);

      const rolesArray = targetRoles.split(",").map(r => r.trim()).filter(Boolean);
      await api.put("/settings/preferences", {
        target_roles: rolesArray.length > 0 ? rolesArray : ["Software Engineer"],
        target_location: targetLocation
      });
      // Silent save
    } catch (e: any) {
      Alert.alert("Error", String(e.response?.data?.detail || e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function pickPdf() {
    const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (res.canceled || !res.assets?.[0]) return;
    const file = res.assets[0];
    const form = new FormData();
    // @ts-ignore
    form.append("file", { uri: file.uri, name: file.name || "resume.pdf", type: "application/pdf" });
    
    try {
      setLoading(true);
      await api.post("/profile/resume-pdf", form, { headers: { "Content-Type": "multipart/form-data" } });
      setHasCv(true);
      Alert.alert("Success", "CV file updated.");
    } catch (e: any) {
      Alert.alert("Error", String(e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function autoFill() {
    try {
      setLoading(true);
      const { data } = await api.post("/profile/auto-fill-from-resume");
      const p = data.profile?.personal || {};
      setFullName(p.full_name || fullName);
      setRoleTitle(p.role_title || roleTitle);
      setEmail(p.email || email);
      setPhone(p.phone || phone);
      setBio(p.bio || bio);
      setSkills(p.skills || skills);
      setExperience(p.work_experience_text || experience);
      setEducation(p.education_text || education);
      setLinks(p.links_text || links);
      setGithubUrl(p.github_url || githubUrl);
      setLinkedinUrl(p.linkedin_url || linkedinUrl);
      setLanguages(p.languages || languages);
      Alert.alert("Success", "Profile updated with AI extraction results.");
    } catch (e: any) {
      Alert.alert("Error", String(e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
     return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 100 }}>
      
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 40 }}>
         <View style={styles.avatarWrapper}>
            <View style={[styles.avatarGlow, { backgroundColor: colors.primary }]} />
            <View style={[styles.avatarBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
               <UserIcon size={58} color={colors.primary} strokeWidth={2} />
            </View>
            <TouchableOpacity 
               onPress={() => router.push("/settings")} 
               activeOpacity={0.8}
               style={[styles.settingsBtnFloating, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
               <Settings size={18} color={colors.text} />
            </TouchableOpacity>
         </View>
         
         <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900", marginTop: 20, letterSpacing: -1 }}>
            {fullName || "Job Seeker"}
         </Text>
         <View style={[styles.roleBadge, { backgroundColor: colors.primary + "15" }]}>
            <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13, textTransform: "uppercase" }}>
               {roleTitle || "Unset Role"}
            </Text>
         </View>
         <Text style={{ color: colors.sub, fontSize: 15, marginTop: 8, opacity: 0.8 }}>{email || "Complete your profile"}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
         <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
               <View style={[styles.iconSurface, { backgroundColor: hasCv ? "rgba(16, 185, 129, 0.15)" : "rgba(248, 113, 113, 0.15)" }]}>
                  <FileText size={24} color={hasCv ? "#10b981" : "#f87171"} />
               </View>
               <View style={{ marginLeft: 16 }}>
                  <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>CV / Resume</Text>
                  <Text style={{ color: colors.sub, marginTop: 4 }}>{hasCv ? "PDF Active" : "No file uploaded"}</Text>
               </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
               {hasCv && (
                  <TouchableOpacity onPress={autoFill} disabled={loading} style={[styles.scanBtn, { backgroundColor: colors.bg, borderColor: colors.primary, borderWidth: 1 }]}>
                    <Zap size={16} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: "bold", marginLeft: 4 }}>Scan CV</Text>
                  </TouchableOpacity>
               )}
               <TouchableOpacity onPress={pickPdf} style={[styles.uploadBtn, { backgroundColor: colors.primary }]}>
                  <Upload size={16} color="#FFF" />
                  <Text style={{ color: "#FFF", fontWeight: "bold", marginLeft: 4 }}>Upload</Text>
               </TouchableOpacity>
            </View>
          </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Personal Information</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label="Full Name" 
            mode="outlined" 
            value={fullName} 
            onChangeText={setFullName}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Professional Role" 
            mode="outlined" 
            value={roleTitle} 
            onChangeText={setRoleTitle}
            textColor={colors.text}
            placeholder="e.g. Senior Frontend Engineer"
            placeholderTextColor={colors.sub}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Email Address" 
            mode="outlined" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Phone Number" 
            mode="outlined" 
            value={phone} 
            onChangeText={setPhone}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Languages" 
            mode="outlined" 
            value={languages} 
            onChangeText={setLanguages}
            textColor={colors.text}
            placeholder="e.g. Armenian (Native), English (Fluent)"
            placeholderTextColor={colors.sub}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
        </Card.Content>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Professional Bio & Socials</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label="Professional Summary" 
            mode="outlined" 
            value={bio} 
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="GitHub URL" 
            mode="outlined" 
            value={githubUrl} 
            onChangeText={setGithubUrl}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="LinkedIn URL" 
            mode="outlined" 
            value={linkedinUrl} 
            onChangeText={setLinkedinUrl}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
        </Card.Content>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Professional Experience</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label="Skills (comma separated)" 
            mode="outlined" 
            value={skills} 
            onChangeText={setSkills}
            multiline
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Work Experience Summary" 
            mode="outlined" 
            value={experience} 
            onChangeText={setExperience}
            multiline
            numberOfLines={4}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
           <TextInput 
            label="Education" 
            mode="outlined" 
            value={education} 
            onChangeText={setEducation}
            multiline
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Portfolio / Other Links" 
            mode="outlined" 
            value={links} 
            onChangeText={setLinks}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
        </Card.Content>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ fontWeight: "800", color: colors.text }}>Search Preferences</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
        <Card.Content style={{ gap: 16, marginTop: 12 }}>
          <TextInput 
            label="Target Roles (comma separated)" 
            mode="outlined" 
            value={targetRoles} 
            onChangeText={setTargetRoles}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
          <TextInput 
            label="Target Location" 
            mode="outlined" 
            value={targetLocation} 
            onChangeText={setTargetLocation}
            textColor={colors.text}
            style={{ backgroundColor: colors.card }}
            theme={{ colors: { primary: colors.primary, onSurfaceVariant: colors.sub, outline: colors.border } }}
          />
        </Card.Content>
      </Card>

    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: { position: "relative", width: 120, height: 120, alignItems: "center", justifyContent: "center" },
  avatarGlow: { position: "absolute", width: 130, height: 130, borderRadius: 65, opacity: 0.1 },
  avatarBox: { width: 110, height: 110, borderRadius: 36, borderWidth: 2, alignItems: "center", justifyContent: "center", elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 8 } },
  settingsBtnFloating: { position: "absolute", bottom: -4, right: -4, width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", elevation: 4 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginTop: 12 },
  sectionHeader: { marginTop: 40, marginBottom: 16, paddingHorizontal: 4 },
  card: { borderRadius: 24, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  iconSurface: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  uploadBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, elevation: 2 },
  scanBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  saveBtn: { marginTop: 40, paddingVertical: 10, borderRadius: 16, elevation: 0 },
});
