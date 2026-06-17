import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { useAppData } from '../hooks/useAppData';
import { fmtShort, fmtLong } from '../utils/helpers';
import { RingCountdown } from '../components/RingCountdown';
import { GoalCard } from '../components/GoalCard';

export default function HomeScreen() {
  const { data, sortedInjections, sortedWeights } = useAppData();
  const today = new Date();

  const injections = sortedInjections();
  const weights = sortedWeights();
  const latestWeight = weights[weights.length - 1];
  const prevWeight = weights.length >= 2 ? weights[weights.length - 2] : null;

  // Next dose calculation
  let daysUntil = 4;
  if (injections.length > 0) {
    const lastDate = new Date(injections[0].date + 'T00:00:00');
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 7);
    daysUntil = Math.round((nextDate.getTime() - today.getTime()) / 86400000);
  }

  const lastInjection = injections[0];
  const delta = prevWeight && latestWeight ? latestWeight.value - prevWeight.value : 0;
  const deltaText = prevWeight
    ? delta === 0
      ? 'No change'
      : `${delta < 0 ? '▼' : '▲'} ${Math.abs(delta).toFixed(1)} lbs`
    : '';

  const lostSoFar = data.profile.startWeight - (latestWeight?.value || data.profile.startWeight);

  // Recent activity
  const events = [
    ...data.injections.map((i) => ({
      type: 'inj' as const,
      date: i.date,
      label: `${i.dose} · ${i.site}`,
    })),
    ...data.weights.map((w) => ({
      type: 'wt' as const,
      date: w.date,
      label: `${w.value} lbs`,
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hi there</Text>
      <Text style={styles.subtitle}>{fmtLong(today)}</Text>

      <RingCountdown daysUntil={daysUntil} />

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Last dose</Text>
          <Text style={styles.statValue}>{lastInjection?.dose || '—'}</Text>
          <Text style={styles.statDelta}>
            {lastInjection ? `${fmtShort(lastInjection.date)} · ${lastInjection.site}` : ''}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current weight</Text>
          <Text style={styles.statValue}>{latestWeight?.value || '—'} lbs</Text>
          <Text style={[styles.statDelta, { color: delta < 0 ? Colors.teal : delta > 0 ? Colors.coral : Colors.inkSoft }]}>
            {deltaText}
          </Text>
        </View>
      </View>

      <GoalCard
        lostSoFar={lostSoFar}
        goalWeight={data.profile.goalWeight}
        startWeight={data.profile.startWeight}
        currentWeight={latestWeight?.value || data.profile.startWeight}
      />

      <Text style={styles.sectionLabel}>Recent activity</Text>
      {events.map((event, idx) => (
        <View key={idx} style={[styles.activityRow, idx === events.length - 1 && { borderBottomWidth: 0 }]}>
          <View style={[styles.actIcon, { backgroundColor: event.type === 'inj' ? Colors.tealLight : Colors.amberLight }]}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={event.type === 'inj' ? Colors.teal : Colors.amber} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              {event.type === 'inj' ? (
                <>
                  <Path d="M5 19 14 10" />
                  <Path d="M16 3l5 5" />
                  <Path d="M9 7l8 8" />
                  <Path d="M3 21l2.5-5.5L8 18 3 21Z" />
                </>
              ) : (
                <>
                  <Circle cx={12} cy={12} r={8} />
                  <Path d="M12 8v4l3 2" />
                </>
              )}
            </Svg>
          </View>
          <View style={styles.actText}>
            <Text style={styles.actTitle}>
              {event.type === 'inj' ? 'Injection logged' : 'Weight logged'}
            </Text>
            <Text style={styles.actSub}>{fmtShort(event.date)} · {event.label}</Text>
          </View>
        </View>
      ))}
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
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12,
  },
  statLabel: {
    fontSize: 11.5,
    color: Colors.inkSoft,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.ink,
  },
  statDelta: {
    fontSize: 11.5,
    marginTop: 3,
    fontWeight: '600',
    color: Colors.inkSoft,
  },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actText: {
    flex: 1,
  },
  actTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.ink,
  },
  actSub: {
    fontSize: 12,
    color: Colors.inkSoft,
    marginTop: 1,
  },
});
