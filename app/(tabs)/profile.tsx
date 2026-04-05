import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

// FSD / Feature Architected Components
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileResumeCard } from "../../components/profile/ProfileResumeCard";
import { ProfilePersonalInfo } from "../../components/profile/ProfilePersonalInfo";
import { ProfileBioSocials } from "../../components/profile/ProfileBioSocials";
import { ProfileExperience } from "../../components/profile/ProfileExperience";
import { ProfileSearchPreferences } from "../../components/profile/ProfileSearchPreferences";
import { useI18n } from "../../lib/i18n";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { api } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  
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
      Alert.alert(t("success"), t("cvUpdated"));
    } catch (e: any) {
      Alert.alert(t("error"), String(e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function autoFill() {
    try {
      setLoading(true);
      const { data } = await api.post("/profile/auto-fill-from-resume");
      const p = data.profile?.personal || {};
      
      if (!p.full_name && !p.email && !p.skills && !p.work_experience_text) {
         Alert.alert(t("extractionFailed"), t("extractionFailedDesc"));
         return;
      }

      setFullName(prev => p.full_name || prev);
      setRoleTitle(prev => p.role_title || prev);
      setEmail(prev => p.email || prev);
      setPhone(prev => p.phone || prev);
      setBio(prev => p.bio || prev);
      setSkills(prev => p.skills || prev);
      setExperience(prev => p.work_experience_text || prev);
      setEducation(prev => p.education_text || prev);
      setLinks(prev => p.links_text || prev);
      setGithubUrl(prev => p.github_url || prev);
      setLinkedinUrl(prev => p.linkedin_url || prev);
      setLanguages(prev => p.languages || prev);
      Alert.alert(t("success"), t("profileUpdatedAI"));
    } catch (e: any) {
      Alert.alert(t("error"), String(e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
     return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1, backgroundColor: colors.bg }} 
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 100 }}
      >
        <ProfileHeader 
          fullName={fullName} 
          roleTitle={roleTitle} 
          email={email} 
          colors={colors} 
          router={router} 
        />
        
        <ProfileResumeCard 
          hasCv={hasCv} 
          loading={loading} 
          colors={colors} 
          autoFill={autoFill} 
          pickPdf={pickPdf} 
        />
        
        <ProfilePersonalInfo 
          fullName={fullName} setFullName={setFullName}
          roleTitle={roleTitle} setRoleTitle={setRoleTitle}
          email={email} setEmail={setEmail}
          phone={phone} setPhone={setPhone}
          languages={languages} setLanguages={setLanguages}
          colors={colors}
        />
        
        <ProfileBioSocials 
          bio={bio} setBio={setBio}
          githubUrl={githubUrl} setGithubUrl={setGithubUrl}
          linkedinUrl={linkedinUrl} setLinkedinUrl={setLinkedinUrl}
          colors={colors}
        />
        
        <ProfileExperience 
          skills={skills} setSkills={setSkills}
          experience={experience} setExperience={setExperience}
          education={education} setEducation={setEducation}
          links={links} setLinks={setLinks}
          colors={colors}
        />
        
        <ProfileSearchPreferences 
          targetRoles={targetRoles} setTargetRoles={setTargetRoles}
          targetLocation={targetLocation} setTargetLocation={setTargetLocation}
          colors={colors}
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
