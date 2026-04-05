import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

interface JobResumeViewerProps {
  colors: any;
  pdfUri: string | null;
  base: string;
  setPdfUri: (val: string | null) => void;
}

export function JobResumeViewer({ colors, pdfUri, base, setPdfUri }: JobResumeViewerProps) {
  return (
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
  );
}
