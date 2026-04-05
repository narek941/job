import React from 'react';
import { View, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { Send } from 'lucide-react-native';

interface JobBottomBarProps {
  insets: { bottom: number };
  colors: any;
  autoApply: boolean;
  setAutoApply: (val: boolean) => void;
  applyRunning: boolean;
  handleApplyFlow: () => void;
}

export function JobBottomBar({ insets, colors, autoApply, setAutoApply, applyRunning, handleApplyFlow }: JobBottomBarProps) {
  return (
    <View style={[styles.bottomBar, { 
        backgroundColor: colors.bg, 
        borderTopColor: colors.border,
        paddingBottom: Math.max(insets.bottom, 24)
    }]}>
       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 }}>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Auto-Apply Flow</Text>
          <Switch value={autoApply} onValueChange={setAutoApply} trackColor={{ true: colors.primary, false: colors.border }} />
       </View>
       <TouchableOpacity 
          style={[styles.applyBtn, { backgroundColor: autoApply ? colors.primary : colors.card, borderColor: colors.primary, borderWidth: autoApply ? 0 : 2 }]}
          activeOpacity={0.8}
          onPress={handleApplyFlow}
          disabled={applyRunning}
       >
          {applyRunning ? (
              <ActivityIndicator color={autoApply ? "#FFF" : colors.primary} />
          ) : (
              <>
                <Send size={20} color={autoApply ? "#FFF" : colors.primary} style={{ marginRight: 10 }} />
                <Text style={{ color: autoApply ? "white" : colors.primary, fontSize: 18, fontWeight: "800" }}>
                  {autoApply ? "Tailor & Auto Apply" : "Fetch Draft Tasks"}
                </Text>
              </>
          )}
       </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
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
  }
});
