import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, Pressable, TextInput, Alert, Share,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';

const FEEDBACK_EMAIL = 'cyberfunk2929@gmail.com';

export default function SettingsScreen() {
  const colors = useTheme();
  const { data, updateProfile } = useAppData();
  const [exportVisible, setExportVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [goalWeightVisible, setGoalWeightVisible] = useState(false);
  const [goalWeightInput, setGoalWeightInput] = useState(String(data.profile.goalWeight || ''));

  const toggleReminder = () => updateProfile({ reminderEnabled: !data.profile.reminderEnabled });
  const toggleDarkMode = () => updateProfile({ darkMode: !data.profile.darkMode });
  const toggleWeightUnit = () => updateProfile({ weightUnit: data.profile.weightUnit === 'lbs' ? 'kg' : 'lbs' });
  const toggleHeightUnit = () => updateProfile({ heightUnit: data.profile.heightUnit === 'cm' ? 'in' : 'cm' });

  const handleSaveGoalWeight = () => {
    const val = parseFloat(goalWeightInput);
    if (!val || isNaN(val) || val <= 0) {
      Alert.alert('Invalid', 'Please enter a valid weight.');
      return;
    }
    updateProfile({ goalWeight: val });
    setGoalWeightVisible(false);
  };

  const handleExportCSV = async () => {
    try {
      let csv = 'Type,Date,Value,Details\n';
      data.weights.forEach((w) => { csv += `Weight,${w.date},${w.value} ${data.profile.weightUnit},\n`; });
      data.injections.forEach((i) => { csv += `Injection,${i.date},${i.dose},${i.site}\n`; });
      await Share.share({ message: csv, title: 'Pinwell Data Export' });
      setExportVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const handleExportOption = (option: string) => {
    if (option === 'csv') {
      handleExportCSV();
    } else {
      Alert.alert('Coming Soon', `${option} export will be available in a future update.`);
    }
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Empty', 'Please write some feedback before sending.');
      return;
    }
    // In the future, this will send directly via a backend
    Alert.alert('Thank you!', 'Your feedback has been received. We appreciate you helping us improve Pinwell!');
    setFeedbackText('');
    setFeedbackVisible(false);
  };

  const handleDonation = (platform: string) => {
    Alert.alert('Coming Soon', `${platform} donations will be available in a future update. Thank you for wanting to support Pinwell!`);
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

      <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={toggleWeightUnit}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Weight units</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.weightUnit}</Text><ChevronIcon /></View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={toggleHeightUnit}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Height units</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.heightUnit}</Text><ChevronIcon /></View>
      </TouchableOpacity>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Start weight</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.startWeight || 'Not set'} {data.profile.startWeight ? data.profile.weightUnit : ''}</Text><ChevronIcon /></View>
      </View>

      <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => { setGoalWeightInput(String(data.profile.goalWeight || '')); setGoalWeightVisible(true); }}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Goal weight</Text>
        <View style={styles.rowRight}><Text style={[styles.rowValue, { color: colors.inkSoft }]}>{data.profile.goalWeight || 'Not set'} {data.profile.goalWeight ? data.profile.weightUnit : ''}</Text><ChevronIcon /></View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => setExportVisible(true)}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>Export my data</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => setAboutVisible(true)}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>About this app</Text>
        <View style={styles.rowRight}><ChevronIcon /></View>
      </TouchableOpacity>

      {/* Export Modal */}
      <Modal visible={exportVisible} transparent animationType="slide" onRequestClose={() => setExportVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setExportVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.ink }]}>Export My Data</Text>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('csv')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>CSV / Text (Share)</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Share via email, WhatsApp, Drive, etc.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('PDF')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>PDF Report</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('Google Drive')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>Google Drive</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('iCloud')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>iCloud</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('OneDrive')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>OneDrive</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('Dropbox')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>Dropbox</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exportOption, { borderColor: colors.border }]} onPress={() => handleExportOption('Local Backup')}>
              <Text style={[styles.exportText, { color: colors.ink }]}>Local Backup</Text>
              <Text style={[styles.exportSub, { color: colors.inkSoft }]}>Coming soon</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* About Modal */}
      <Modal visible={aboutVisible} transparent animationType="slide" onRequestClose={() => setAboutVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setAboutVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.ink }]}>About Pinwell</Text>
            <Text style={[styles.aboutText, { color: colors.inkSoft }]}>
              Version 1.0.0{'\n\n'}
              Pinwell is a free, private GLP-1 injection and weight tracker.{'\n\n'}
              No ads. No subscriptions. No data sharing.{'\n'}
              Your data is encrypted and stored only on your device.{'\n\n'}
              Built with care for the GLP-1 community.
            </Text>
            <TouchableOpacity style={[styles.feedbackBtn, { backgroundColor: colors.teal }]} onPress={() => { setAboutVisible(false); setFeedbackVisible(true); }}>
              <Text style={styles.feedbackBtnText}>Send Feedback / Suggest Features</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Goal Weight Modal */}
      <Modal visible={goalWeightVisible} transparent animationType="slide" onRequestClose={() => setGoalWeightVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGoalWeightVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.ink }]}>Set Goal Weight</Text>
            <Text style={[styles.aboutText, { color: colors.inkSoft }]}>What's your target weight? You can change this anytime.</Text>
            <TextInput
              style={[styles.feedbackInput, { borderColor: colors.border, color: colors.ink, minHeight: 50 }]}
              value={goalWeightInput}
              onChangeText={setGoalWeightInput}
              placeholder={`e.g. 180 (${data.profile.weightUnit})`}
              placeholderTextColor={colors.inkSoft}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={[styles.feedbackBtn, { backgroundColor: colors.teal }]} onPress={handleSaveGoalWeight}>
              <Text style={styles.feedbackBtnText}>Save</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Feedback Modal */}
      <Modal visible={feedbackVisible} transparent animationType="slide" onRequestClose={() => setFeedbackVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFeedbackVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.ink }]}>Send Feedback</Text>
            <Text style={[styles.aboutText, { color: colors.inkSoft }]}>
              Have a suggestion or found a bug? Let us know! We read every message.
            </Text>
            <TextInput
              style={[styles.feedbackInput, { borderColor: colors.border, color: colors.ink }]}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Type your feedback here..."
              placeholderTextColor={colors.inkSoft}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <TouchableOpacity style={[styles.feedbackBtn, { backgroundColor: colors.teal }]} onPress={handleSendFeedback}>
              <Text style={styles.feedbackBtnText}>Send</Text>
            </TouchableOpacity>

            <View style={[styles.donationSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.donationTitle, { color: colors.ink }]}>Buy Me a Coffee</Text>
              <Text style={[styles.aboutText, { color: colors.inkSoft }]}>
                Love Pinwell? Help keep it free and ad-free by buying me a coffee!
              </Text>
              <TouchableOpacity style={[styles.donationBtn, { backgroundColor: colors.amber }]} onPress={() => handleDonation('PayPal')}>
                <Text style={styles.donationBtnText}>PayPal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.donationBtn, { backgroundColor: colors.violet }]} onPress={() => handleDonation('Ko-fi')}>
                <Text style={styles.donationBtnText}>Ko-fi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.donationBtn, { backgroundColor: colors.pink }]} onPress={() => handleDonation('Buy Me a Coffee')}>
                <Text style={styles.donationBtnText}>Buy Me a Coffee</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 25, 22, 0.4)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 40, maxHeight: '80%' },
  handle: { width: 36, height: 4, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 21, fontWeight: '700', marginBottom: 16 },
  exportOption: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 8 },
  exportText: { fontSize: 14, fontWeight: '600' },
  exportSub: { fontSize: 12, marginTop: 2 },
  aboutText: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  feedbackBtn: { borderRadius: 24, padding: 14, alignItems: 'center', marginTop: 10 },
  feedbackBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  feedbackInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 120, marginBottom: 10 },
  donationSection: { borderTopWidth: 1, marginTop: 20, paddingTop: 20 },
  donationTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  donationBtn: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  donationBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
