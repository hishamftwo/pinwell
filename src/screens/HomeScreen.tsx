import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';
import { fmtShort, fmtLong } from '../utils/helpers';
import { RingCountdown } from '../components/RingCountdown';
import { GoalCard } from '../components/GoalCard';

export default function HomeScreen() {
  const colors = useTheme();
  const { data, sortedInjections, sortedWeights } = useAppData();
  const today = new Date();

  const injections = sortedInjections();
  const weights = sortedWeights();
  const latestWeight = weights[weights.length - 1];
  const prevWeight = weights.length >= 2 ? weights[weights.length - 2] : null;

  // Next dose calculation
  let daysUntil = 7;
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
      : `${delta < 0 ? '\u25BC' : '\u25B2'} ${Math.abs(delta).toFixed(1)} lbs`
    : '';

  const lostSoFar = data.profile.startWeight - (latestWeight?.value || data.profile.startWeight);

  // Recent activity
  const events = [
    ...data.injections.map((i) => ({ type: 'inj' as const, date: i.date, label: `${i.dose} \u00B7 ${i.site}` })),
    ...data.weights.map((w) => ({ type: 'wt' as const, date: w.date, label: `${w.value} lbs` })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 4);

  const hasData = injections.length > 0 || weights.length > 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgApp }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.ink }]}>Hi there</Text>
      <Text style={[styles.subtitle, { color: colors.inkSoft }]}>{fmtLong(today)}</Text>

      {injections.length > 0 && <RingCountdown daysUntil={daysUntil} />}

      {!hasData && (
        <View style={[styles.emptyCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>Welcome!</Text>
          <Text style={[styles.emptyText, { color: colors.inkSoft }]}>
            Tap the + button below to log your first injection or weight entry.
          </Text>
        </View>
      )}

      {hasData && (
        <View style={styles.statRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.inkSoft }]}>Last dose</Text>
            <Text style={[styles.statValue, { color: colors.ink }]}>{lastInjection?.dose || '\u2014'}</Text>
            <Text style={[styles.statDelta, { color: colors.inkSoft }]}>
              {lastInjection ? `${fmtShort(lastInjection.date)} \u00B7 ${lastInjection.site}` : ''}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.inkSoft }]}>Current weight</Text>
            <Text style={[styles.statValue, { color: colors.ink }]}>{latestWeight?.value || '\u2014'} lbs</Text>
            <Text style={[styles.statDelta, { color: delta < 0 ? colors.teal : delta > 0 ? colors.coral : colors.inkSoft }]}>
              {deltaText}
            </Text>
          </View>
        </View>
      )}

      {data.profile.goalWeight > 0 && latestWeight && (
        <GoalCard
          lostSoFar={lostSoFar}
          goalWeight={data.profile.goalWeight}
          startWeight={data.profile.startWeight}
          currentWeight={latestWeight.value}
        />
      )}

      {events.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.inkSoft }]}>Recent activity</Text>
          {events.map((event, idx) => (
            <View key={idx} style={[styles.activityRow, { borderBottomColor: colors.border }, idx === events.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.actIcon, { backgroundColor: event.type === 'inj' ? colors.tealLight : colors.amberLight }]}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={event.type === 'inj' ? colors.teal : colors.amber} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
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
                <Text style={[styles.actTitle, { color: colors.ink }]}>
                  {event.type === 'inj' ? 'Injection logged' : 'Weight logged'}
                </Text>
                <Text style={[styles.actSub, { color: colors.inkSoft }]}>{fmtShort(event.date)} \u00B7 {event.label}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 18 },
  emptyCard: { borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center', marginVertical: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 18, marginBottom: 18 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12 },
  statLabel: { fontSize: 11.5, marginBottom: 4 },
  statValue: { fontSize: 17, fontWeight: '700' },
  statDelta: { fontSize: 11.5, marginTop: 3, fontWeight: '600' },
  sectionLabel: { fontSize: 12.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 18, marginBottom: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1 },
  actIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  actText: { flex: 1 },
  actTitle: { fontSize: 13.5, fontWeight: '600' },
  actSub: { fontSize: 12, marginTop: 1 },
});
