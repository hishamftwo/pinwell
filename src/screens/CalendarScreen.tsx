import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';
import { ymd, fmtShort, getDaysInMonth, getFirstDayOfWeek } from '../utils/helpers';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarScreen() {
  const colors = useTheme();
  const { data } = useAppData();
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const injSet = new Set(data.injections.map((i) => i.date));
  const wtSet = new Set(data.weights.map((w) => w.date));
  const monthLabel = displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setDisplayMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setDisplayMonth(new Date(year, month + 1, 1));

  const selectedInj = selectedDay ? data.injections.find((i) => i.date === selectedDay) : null;
  const selectedWt = selectedDay ? data.weights.find((w) => w.date === selectedDay) : null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgApp }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.ink }]}>Calendar</Text>
      <Text style={[styles.subtitle, { color: colors.inkSoft }]}>Injection and weight history at a glance.</Text>

      <View style={styles.calNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M15 6l-6 6 6 6" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.calMonth, { color: colors.ink }]}>{monthLabel}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 6l6 6-6 6" />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.calGrid}>
        {DOW.map((d, i) => (
          <View key={`dow-${i}`} style={styles.calCell}>
            <Text style={[styles.calDow, { color: colors.inkSoft }]}>{d}</Text>
          </View>
        ))}
        {Array(firstDow).fill(null).map((_, i) => <View key={`empty-${i}`} style={styles.calCell} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const dateObj = new Date(year, month, day);
          const key = ymd(dateObj);
          const isToday = key === ymd(today);
          const isSelected = key === selectedDay;
          const hasInj = injSet.has(key);
          const hasWt = wtSet.has(key);

          return (
            <TouchableOpacity
              key={key}
              style={[styles.calCell, styles.calDay, isToday && { borderWidth: 1.5, borderColor: colors.ink }, isSelected && { backgroundColor: colors.tealLight }]}
              onPress={() => setSelectedDay(key)}
            >
              <Text style={[styles.calDayText, { color: colors.ink }, isToday && { fontWeight: '700' }]}>{day}</Text>
              <View style={styles.calDots}>
                {hasInj && <View style={[styles.calDot, { backgroundColor: colors.teal }]} />}
                {hasWt && <View style={[styles.calDot, { backgroundColor: colors.amber }]} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.teal }]} />
          <Text style={[styles.legendText, { color: colors.inkSoft }]}>Injection</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.amber }]} />
          <Text style={[styles.legendText, { color: colors.inkSoft }]}>Weight logged</Text>
        </View>
      </View>

      {selectedDay && (
        <View style={[styles.dayDetail, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.dayDetailText, { color: colors.ink }]}>
            {fmtShort(selectedDay)} —{' '}
            {selectedInj || selectedWt
              ? [selectedInj && `Injected ${selectedInj.dose}, ${selectedInj.site}`, selectedWt && `Weight ${selectedWt.value} lbs`].filter(Boolean).join(' \u00B7 ')
              : 'no entries. Tap + to log something.'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 18 },
  calNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  navBtn: { padding: 4 },
  calMonth: { fontWeight: '700', fontSize: 15 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%' as any, alignItems: 'center', paddingVertical: 6 },
  calDow: { fontSize: 10.5, fontWeight: '600' },
  calDay: { borderRadius: 10, paddingVertical: 7, paddingHorizontal: 2, minHeight: 44 },
  calDayText: { fontSize: 13, textAlign: 'center' },
  calDots: { flexDirection: 'row', justifyContent: 'center', gap: 3, marginTop: 3 },
  calDot: { width: 5, height: 5, borderRadius: 2.5 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { fontSize: 12 },
  dayDetail: { marginTop: 14, borderWidth: 1, borderRadius: 14, padding: 12 },
  dayDetailText: { fontSize: 13, lineHeight: 18 },
});
