import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { useAppData } from '../hooks/useAppData';

export default function SettingsScreen() {
  const { data, updateProfile } = useAppData();

  const toggleReminder = () => {
    updateProfile({ reminderEnabled: !data.profile.reminderEnabled });
  };

  const ChevronIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>A few things you can control here.</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Weekly dose reminder</Text>
        <TouchableOpacity onPress={toggleReminder} style={[styles.toggle, data.profile.reminderEnabled && styles.toggleOn]}>
          <View style={[styles.knob, data.profile.reminderEnabled && styles.knobOn]} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Reminder time</Text>
        <View style={styles.rowRight}><Text style={styles.rowValue}>9:00 AM</Text><ChevronIcon /></View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Weight units</Text>
        <View style={styles.rowRight}><Text style={styles.rowValue}>{data.profile.weightUnit}</Text><ChevronIcon /></View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Start weight</Text>
        <View style={styles.rowRight}><Text style={styles.rowValue}>{data.profile.startWeight} lbs</Text><ChevronIcon /></View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Goal weight</Text>
        <View style={styles.rowRight}><Text style={styles.rowValue}>{data.profile.goalWeight} lbs</Text><ChevronIcon /></View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Export my data</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </View>

      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Text style={styles.rowLabel}>About this app</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', color: Colors.ink, marginBottom: 2 },
  subtitle: { fontSize: 13, color: Colors.inkSoft, marginBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: 14, color: Colors.ink },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 13, color: Colors.inkSoft },
  toggle: { width: 38, height: 22, borderRadius: 12, backgroundColor: Colors.border, justifyContent: 'center', paddingHorizontal: 2 },
  toggleOn: { backgroundColor: Colors.teal },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF' },
  knobOn: { alignSelf: 'flex-end' },
});
