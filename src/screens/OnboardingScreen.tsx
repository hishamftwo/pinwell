import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';

export default function OnboardingScreen() {
  const colors = useTheme();
  const { completeOnboarding } = useAppData();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [error, setError] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(true);

  const handleSave = () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!age || isNaN(Number(age)) || Number(age) <= 0) { setError('Please enter a valid age.'); return; }
    if (!sex) { setError('Please select your sex.'); return; }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) { setError('Please enter your current weight.'); return; }
    if (!height || isNaN(Number(height)) || Number(height) <= 0) { setError('Please enter your height.'); return; }

    completeOnboarding(
      {
        name: name.trim(),
        age: Number(age),
        sex,
        startWeight: Number(weight),
        height: Number(height),
        weightUnit,
        heightUnit,
        onboardingComplete: true,
      },
      { date: new Date().toISOString().split('T')[0], value: Number(weight) }
    );
  };

  const SexOption = ({ value, label }: { value: 'male' | 'female' | 'other'; label: string }) => (
    <TouchableOpacity
      style={[styles.sexOption, { borderColor: colors.border }, sex === value && { backgroundColor: colors.tealLight, borderColor: colors.teal }]}
      onPress={() => { setSex(value); setError(''); }}
    >
      <Text style={[styles.sexText, { color: colors.ink }, sex === value && { color: colors.teal, fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );

  const UnitToggle = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: any) => void }) => (
    <View style={styles.unitRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.unitBtn, { borderColor: colors.border }, value === opt && { backgroundColor: colors.tealLight, borderColor: colors.teal }]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.unitBtnText, { color: colors.ink }, value === opt && { color: colors.teal, fontWeight: '600' }]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bgApp }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.ink }]}>Welcome to Pinwell</Text>
        <Text style={[styles.subtitle, { color: colors.inkSoft }]}>
          Let's get you set up in seconds.
        </Text>

        {showPrivacy && (
          <View style={[styles.privacyCard, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
            <TouchableOpacity style={styles.privacyClose} onPress={() => setShowPrivacy(false)}>
              <Text style={[styles.privacyCloseText, { color: colors.teal }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.privacyTitle, { color: colors.teal }]}>Hey, quick note!</Text>
            <Text style={[styles.privacyText, { color: colors.ink }]}>
              Pinwell is 100% free. No sneaky charges, no subscriptions, no annoying ads. We promise.{'\n\n'}
              Oh, and your data? It's encrypted and lives only on YOUR phone. We can't see it, nobody else can see it. It's yours and yours alone.
            </Text>
          </View>
        )}

        <Text style={[styles.label, { color: colors.inkSoft }]}>Your name</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.ink }]}
          value={name}
          onChangeText={(t) => { setName(t); setError(''); }}
          placeholder="e.g. Hisham"
          placeholderTextColor={colors.inkSoft}
        />

        <Text style={[styles.label, { color: colors.inkSoft }]}>Age</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.ink }]}
          value={age}
          onChangeText={(t) => { setAge(t); setError(''); }}
          placeholder="e.g. 32"
          placeholderTextColor={colors.inkSoft}
          keyboardType="number-pad"
        />

        <Text style={[styles.label, { color: colors.inkSoft }]}>Sex</Text>
        <View style={styles.sexRow}>
          <SexOption value="male" label="Male" />
          <SexOption value="female" label="Female" />
          <SexOption value="other" label="Other" />
        </View>

        <Text style={[styles.label, { color: colors.inkSoft }]}>Current weight</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={[styles.inputFlex, { borderColor: colors.border, color: colors.ink }]}
            value={weight}
            onChangeText={(t) => { setWeight(t); setError(''); }}
            placeholder="e.g. 210"
            placeholderTextColor={colors.inkSoft}
            keyboardType="decimal-pad"
          />
          <UnitToggle value={weightUnit} options={['lbs', 'kg']} onChange={setWeightUnit} />
        </View>

        <Text style={[styles.label, { color: colors.inkSoft }]}>Height</Text>
        <View style={styles.inputWithUnit}>
          <TextInput
            style={[styles.inputFlex, { borderColor: colors.border, color: colors.ink }]}
            value={height}
            onChangeText={(t) => { setHeight(t); setError(''); }}
            placeholder="e.g. 175"
            placeholderTextColor={colors.inkSoft}
            keyboardType="number-pad"
          />
          <UnitToggle value={heightUnit} options={['cm', 'in']} onChange={setHeightUnit} />
        </View>

        {error ? <Text style={[styles.error, { color: colors.coral }]}>{error}</Text> : null}

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.teal }]} onPress={handleSave}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 70, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  privacyCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 24, position: 'relative' },
  privacyClose: { position: 'absolute', top: 10, right: 12, zIndex: 1, padding: 4 },
  privacyCloseText: { fontSize: 18, fontWeight: '600' },
  privacyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  privacyText: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  inputWithUnit: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputFlex: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  unitRow: { flexDirection: 'row', gap: 4 },
  unitBtn: { paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderRadius: 10 },
  unitBtnText: { fontSize: 13, fontWeight: '500' },
  sexRow: { flexDirection: 'row', gap: 10 },
  sexOption: { flex: 1, paddingVertical: 12, borderWidth: 1, borderRadius: 12, alignItems: 'center' },
  sexText: { fontSize: 14, fontWeight: '500' },
  error: { fontSize: 13, marginTop: 12 },
  btn: { borderRadius: 24, padding: 16, alignItems: 'center', marginTop: 30 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
