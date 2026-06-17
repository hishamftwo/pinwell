import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';

export default function SettingsScreen() {
  const colors = useTheme();
  const { data, updateProfile } = useAppData();

  const toggleReminder = () => {
    updateProfile({ reminderEnabled: !data.profile.reminderEnabled });
  };

  const toggleDarkMode = () => {
    updateProfile({ darkMode: !data.profile.darkMode });
  };

  const ChevronIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );

  const Toggle = ({ value, onPress }: { value: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.toggle, { backgroundColor: value ? colors.teal : colors.border }]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgApp }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.ink }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.inkSoft }]}>A few things you can control here.</Text>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Dark mode</Text>
        <Toggle value={data.profile.darkMode} onPress={toggleDarkMode} />
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Weekly dose reminder</Text>
        <Toggle value={data.profile.reminderEnabled} onPress={toggleReminder} />
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Reminder time</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>9:00 AM</Text><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Weight units</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.weightUnit}</Text><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Start weight</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.startWeight || 'Not set'} {data.profile.startWeight ? 'lbs' : ''}</Text><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Goal weight</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.goalWeight || 'Not set'} {data.profile.goalWeight ? 'lbs' : ''}</Text><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Export my data</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>About this app</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1 },
  rowLabel: { fontSize: 14 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 13 },
  toggle: { width: 38, height: 22, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 2 },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF' },
  knobOn: { alignSelf: 'flex-end' as const },
});
