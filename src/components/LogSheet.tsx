import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { useAppData } from '../hooks/useAppData';
import { ymd } from '../utils/helpers';

type SheetMode = 'choose' | 'injection' | 'weight';

interface LogSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialMode?: SheetMode;
}

const DOSES = ['2.5 mg', '5 mg', '7.5 mg', '10 mg', '12.5 mg', '15 mg'];
const SITES = ['Abdomen', 'Thigh', 'Upper arm', 'Other'];

export function LogSheet({ visible, onClose, onSuccess, initialMode = 'choose' }: LogSheetProps) {
  const { addInjection, addWeight } = useAppData();
  const [mode, setMode] = useState<SheetMode>(initialMode);
  const [error, setError] = useState('');

  // Injection form state
  const [injDate, setInjDate] = useState(ymd(new Date()));
  const [injDose, setInjDose] = useState('');
  const [injSite, setInjSite] = useState('Abdomen');

  // Weight form state
  const [wtDate, setWtDate] = useState(ymd(new Date()));
  const [wtValue, setWtValue] = useState('');

  const reset = () => {
    setMode(initialMode || 'choose');
    setError('');
    setInjDate(ymd(new Date()));
    setInjDose('');
    setInjSite('Abdomen');
    setWtDate(ymd(new Date()));
    setWtValue('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const saveInjection = () => {
    if (!injDose) {
      setError('Please select a dose.');
      return;
    }
    addInjection({ date: injDate, dose: injDose, site: injSite });
    handleClose();
    onSuccess('Injection logged ✓');
  };

  const saveWeight = () => {
    const val = parseFloat(wtValue);
    if (!val || isNaN(val)) {
      setError('Please enter a weight.');
      return;
    }
    addWeight({ date: wtDate, value: val });
    handleClose();
    onSuccess('Weight logged ✓');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheetWrapper}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />

            {mode === 'choose' && (
              <>
                <TouchableOpacity
                  style={styles.choiceRow}
                  onPress={() => { setMode('injection'); setError(''); }}
                >
                  <View style={[styles.choiceIcon, { backgroundColor: Colors.tealLight }]}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.teal} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M5 19 14 10" />
                      <Path d="M16 3l5 5" />
                      <Path d="M9 7l8 8" />
                      <Path d="M3 21l2.5-5.5L8 18 3 21Z" />
                    </Svg>
                  </View>
                  <View>
                    <Text style={styles.choiceTitle}>Log injection</Text>
                    <Text style={styles.choiceSub}>Date, dose, site</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceRow}
                  onPress={() => { setMode('weight'); setError(''); }}
                >
                  <View style={[styles.choiceIcon, { backgroundColor: Colors.amberLight }]}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.amber} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <Circle cx={12} cy={12} r={8} />
                      <Path d="M12 8v4l3 2" />
                    </Svg>
                  </View>
                  <View>
                    <Text style={styles.choiceTitle}>Log weight</Text>
                    <Text style={styles.choiceSub}>The number on the scale today</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {mode === 'injection' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sheetTitle}>Log injection</Text>

                <Text style={styles.fieldLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={injDate}
                  onChangeText={setInjDate}
                  placeholder="YYYY-MM-DD"
                />

                <Text style={styles.fieldLabel}>Dose</Text>
                <View style={styles.optionGrid}>
                  {DOSES.map((dose) => (
                    <TouchableOpacity
                      key={dose}
                      style={[
                        styles.option,
                        injDose === dose && styles.optionSelected,
                      ]}
                      onPress={() => { setInjDose(dose); setError(''); }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          injDose === dose && styles.optionTextSelected,
                        ]}
                      >
                        {dose}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>Injection site</Text>
                <View style={styles.optionGrid}>
                  {SITES.map((site) => (
                    <TouchableOpacity
                      key={site}
                      style={[
                        styles.option,
                        injSite === site && styles.optionSelected,
                      ]}
                      onPress={() => setInjSite(site)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          injSite === site && styles.optionTextSelected,
                        ]}
                      >
                        {site}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.btn} onPress={saveInjection}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {mode === 'weight' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sheetTitle}>Log weight</Text>

                <Text style={styles.fieldLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={wtDate}
                  onChangeText={setWtDate}
                  placeholder="YYYY-MM-DD"
                />

                <Text style={styles.fieldLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={wtValue}
                  onChangeText={(t) => { setWtValue(t); setError(''); }}
                  placeholder="e.g. 199.5"
                  keyboardType="decimal-pad"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.btn} onPress={saveWeight}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 25, 22, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '82%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    marginBottom: 10,
  },
  choiceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  choiceSub: {
    fontSize: 12,
    color: Colors.inkSoft,
    marginTop: 1,
  },
  sheetTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12.5,
    color: Colors.inkSoft,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: Colors.tealLight,
    borderColor: Colors.teal,
  },
  optionText: {
    fontSize: 13,
    color: Colors.ink,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.teal,
    fontWeight: '600',
  },
  error: {
    color: Colors.coral,
    fontSize: 12,
    marginTop: 8,
  },
  btn: {
    backgroundColor: Colors.teal,
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
