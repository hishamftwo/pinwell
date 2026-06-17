import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { useAppData } from '../hooks/useAppData';
import { ymd, fmtShort, getDaysInMonth, getFirstDayOfWeek } from '../utils/helpers';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.subtitle}>Injection and weight history at a glance.</Text>

      <View style={styles.calNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M15 6l-6 6 6 6" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.calMonth}>{monthLabel}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.inkSoft} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 6l6 6-6 6" />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.calGrid}>
        {DOW.map((d, i) => (
          <View key={`dow-${i}`} style={styles.calCell}>
            <Text style={styles.calDow}>{d}</Text>
          </View>
        ))}
        {Array(firstDow)
          .fill(null)
          .map((_, i) => (
            <View key={`empty-${i}`} style={styles.calCell} />
          ))}
        {Array(daysInMonth)
          .fill(null)
          .map((_, i) => {
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
                style={[
                  styles.calCell,
                  styles.calDay,
                  isToday && styles.calToday,
                  isSelected && styles.calSelected,
                ]}
                onPress={() => setSelectedDay(key)}
              >
                <Text
                  style={[
                    styles.calDayText,
                    isToday && styles.calTodayText,
                    isSelected && styles.calSelectedText,
                  ]}
                >
                  {day}
                </Text>
                <View style={styles.calDots}>
                  {hasInj && <View style={[styles.calDot, { backgroundColor: Colors.teal }]} />}
                  {hasWt && <View style={[styles.calDot, { backgroundColor: Colors.amber }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.teal }]} />
          <Text style={styles.legendText}>Injection</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.amber }]} />
          <Text style={styles.legendText}>Weight logged</Text>
        </View>
      </View>

      {selectedDay && (
        <View style={styles.dayDetail}>
          <Text style={styles.dayDetailText}>
            {fmtShort(selectedDay)} —{' '}
            {selectedInj || selectedWt
              ? [
                  selectedInj && `Injected ${selectedInj.dose}, ${selectedInj.site}`,
                  selectedWt && `Weight ${selectedWt.value} lbs`,
                ]
                  .filter(Boolean)
                  .join(' · ')
              : 'no entries. Tap + to log something.'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.inkSoft,
    marginBottom: 18,
  },
  calNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBtn: {
    padding: 4,
  },
  calMonth: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.ink,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%' as any,
    alignItems: 'center',
    paddingVertical: 6,
  },
  calDow: {
    fontSize: 10.5,
    color: Colors.inkSoft,
    fontWeight: '600',
  },
  calDay: {
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 2,
    minHeight: 44,
  },
  calToday: {
    borderWidth: 1.5,
    borderColor: Colors.ink,
  },
  calSelected: {
    backgroundColor: Colors.tealLight,
  },
  calDayText: {
    fontSize: 13,
    color: Colors.ink,
    textAlign: 'center',
  },
  calTodayText: {
    fontWeight: '700',
  },
  calSelectedText: {
    fontWeight: '600',
  },
  calDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    marginTop: 3,
  },
  calDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.inkSoft,
  },
  dayDetail: {
    marginTop: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
  },
  dayDetailText: {
    fontSize: 13,
    color: Colors.ink,
    lineHeight: 18,
  },
});
