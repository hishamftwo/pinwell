import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface GoalCardProps {
  lostSoFar: number;
  goalWeight: number;
  startWeight: number;
  currentWeight: number;
  showDetails?: boolean;
}

export function GoalCard({ lostSoFar, goalWeight, startWeight, currentWeight, showDetails = false }: GoalCardProps) {
  const colors = useTheme();
  const rangeTotal = startWeight - goalWeight;
  const pct = rangeTotal > 0 ? Math.max(0, Math.min(100, (lostSoFar / rangeTotal) * 100)) : 100;
  const remaining = Math.max(0, currentWeight - goalWeight);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.numbers}>
        <Text style={[styles.bigNumber, { color: colors.teal }]}>{lostSoFar.toFixed(1)} lbs lost</Text>
        <Text style={[styles.smallText, { color: colors.inkSoft }]}>
          {showDetails ? `${remaining.toFixed(1)} lbs to goal` : `goal ${goalWeight} lbs`}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct.toFixed(0)}%` as any, backgroundColor: colors.teal }]} />
      </View>
      <View style={styles.caption}>
        <Text style={[styles.captionText, { color: colors.inkSoft }]}>
          {showDetails ? `Start ${startWeight} lbs` : `${pct.toFixed(0)}% of the way there`}
        </Text>
        <Text style={[styles.captionText, { color: colors.inkSoft }]}>
          {showDetails ? `Goal ${goalWeight} lbs` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16 },
  numbers: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  bigNumber: { fontSize: 22, fontWeight: '800' },
  smallText: { fontSize: 12 },
  track: { height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  fill: { height: '100%', borderRadius: 6 },
  caption: { flexDirection: 'row', justifyContent: 'space-between' },
  captionText: { fontSize: 11.5 },
});
