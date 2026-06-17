import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle as SvgCircle, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { useAppData } from '../hooks/useAppData';
import { fmtShort, getDoseColor } from '../utils/helpers';
import { GoalCard } from '../components/GoalCard';

export default function WeightScreen() {
  const { data, sortedInjections, sortedWeights } = useAppData();
  const weights = sortedWeights();
  const injections = sortedInjections();
  const injectionsAsc = [...data.injections].sort((a, b) => (a.date < b.date ? -1 : 1));

  if (weights.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.subtitle}>No weight data yet. Tap + to log your first weight.</Text>
      </View>
    );
  }

  const first = weights[0];
  const latest = weights[weights.length - 1];
  const totalChange = (latest.value - first.value).toFixed(1);
  const lostSoFar = data.profile.startWeight - latest.value;

  const W = 300, H = 120, pad = 10;
  const vals = weights.map((p) => p.value);
  const dataMin = Math.min(...vals), dataMax = Math.max(...vals);
  const span = dataMax - dataMin || 5;
  let minV = dataMin - 2, maxV = dataMax + 2;
  const goal = data.profile.goalWeight;
  const showGoalLine = goal >= dataMin - span * 1.5 && goal <= dataMax + span * 1.5;
  if (showGoalLine) { minV = Math.min(minV, goal - 2); maxV = Math.max(maxV, goal + 2); }

  const pts = weights.map((p, i) => ({
    x: pad + (i / (weights.length - 1 || 1)) * (W - 2 * pad),
    y: pad + (1 - (p.value - minV) / (maxV - minV)) * (H - 2 * pad),
  }));


  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${H - pad} L${pts[0].x.toFixed(1)},${H - pad} Z`;
  const goalY = showGoalLine ? pad + (1 - (goal - minV) / (maxV - minV)) * (H - 2 * pad) : 0;

  const insights = computeInsights(weights, injections, data.profile.goalWeight);
  const weightsDesc = [...weights].reverse();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>
        {Number(totalChange) < 0 ? 'Down' : 'Up'} {Math.abs(Number(totalChange))} lbs since {fmtShort(first.date)}
      </Text>

      <GoalCard
        lostSoFar={lostSoFar}
        goalWeight={data.profile.goalWeight}
        startWeight={data.profile.startWeight}
        currentWeight={latest.value}
        showDetails
      />

      <View style={styles.chartWrap}>
        <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={120}>
          <Path d={areaPath} fill={Colors.tealLight} />
          <Path d={linePath} fill="none" stroke={Colors.teal} strokeWidth={2.2} />
          {showGoalLine && (
            <>
              <Line x1={pad} y1={goalY} x2={W - pad} y2={goalY} stroke={Colors.pink} strokeWidth={1.5} strokeDasharray="4 4" />
              <SvgText x={W - pad} y={goalY - 5} textAnchor="end" fontSize={9.5} fill={Colors.pink}>Goal</SvgText>
            </>
          )}
          {pts.map((p, i) => (
            <SvgCircle key={i} cx={p.x} cy={p.y} r={3} fill={Colors.teal} />
          ))}
        </Svg>
      </View>

      <Text style={styles.sectionLabel}>Dose history</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doseRow}>
        {injectionsAsc.map((inj, i) => {
          const c = getDoseColor(inj.dose);
          return (
            <React.Fragment key={inj.id}>
              <View style={styles.doseChip}>
                <View style={[styles.doseCircle, { backgroundColor: c.bg }]}>
                  <Text style={[styles.doseCircleText, { color: c.fg }]}>{inj.dose.replace(' mg', '')}</Text>
                </View>
                <Text style={styles.doseDate}>{fmtShort(inj.date)}</Text>
              </View>
              {i < injectionsAsc.length - 1 && <View style={styles.doseLine} />}
            </React.Fragment>
          );
        })}
      </ScrollView>


      {insights.length > 0 && (
        <>
          <View style={styles.insightHead}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={Colors.violet} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
            </Svg>
            <Text style={styles.sectionLabel}>Insights</Text>
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>smart</Text>
            </View>
          </View>
          {insights.map((ins, i) => (
            <View key={i} style={[styles.insightCard, { borderLeftColor: ins.color }]}>
              <Text style={styles.insightText}>{ins.text}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>History</Text>
      {weightsDesc.map((w, i) => {
        const prev = weightsDesc[i + 1];
        const d = prev ? w.value - prev.value : 0;
        const dText = prev ? (d === 0 ? 'no change' : `${d < 0 ? '▼' : '▲'} ${Math.abs(d).toFixed(1)} lbs`) : '';
        return (
          <View key={w.id} style={[styles.entryRow, i === weightsDesc.length - 1 && { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.entryValue}>{w.value} lbs</Text>
              <Text style={styles.entryDate}>{fmtShort(w.date)}</Text>
            </View>
            <Text style={[styles.entryDelta, { color: d < 0 ? Colors.teal : d > 0 ? Colors.coral : Colors.inkSoft }]}>{dText}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}


function computeInsights(
  weights: { date: string; value: number }[],
  injections: { date: string; dose: string }[],
  goalWeight: number
) {
  const out: { type: string; color: string; text: string }[] = [];
  if (weights.length >= 2) {
    const recent = weights.slice(-Math.min(4, weights.length));
    const newest = recent[recent.length - 1], oldest = recent[0];
    const daysSpan = (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / 86400000;
    const weeksSpan = daysSpan / 7 || 1;
    const rate = (newest.value - oldest.value) / weeksSpan;
    if (rate < -0.1) {
      out.push({ type: 'positive', color: Colors.green, text: `You are averaging about ${Math.abs(rate).toFixed(1)} lbs lost per week — a steady, sustainable pace.` });
      const remaining = newest.value - goalWeight;
      if (remaining > 0) {
        const weeksToGoal = Math.round(remaining / Math.abs(rate));
        out.push({ type: 'info', color: Colors.violet, text: `At this pace, you could reach your ${goalWeight} lb goal in roughly ${weeksToGoal} more weeks.` });
      }
    } else if (rate > 0.1) {
      out.push({ type: 'attention', color: Colors.amber, text: 'Weight has ticked up slightly over your last few entries.' });
    } else {
      out.push({ type: 'info', color: Colors.violet, text: 'Your weight has been holding fairly steady over recent entries.' });
    }
  }
  if (injections.length >= 2) {
    const latestDose = parseFloat(injections[0].dose), prevDose = parseFloat(injections[1].dose);
    if (latestDose > prevDose) {
      out.push({ type: 'info', color: Colors.violet, text: `Your dose stepped up from ${injections[1].dose} to ${injections[0].dose} — many people see loss accelerate after a step up.` });
    }
  }
  return out.slice(0, 3);
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', color: Colors.ink, marginBottom: 2 },
  subtitle: { fontSize: 13, color: Colors.inkSoft, marginBottom: 18 },
  chartWrap: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, marginBottom: 16 },
  sectionLabel: { fontSize: 12.5, fontWeight: '600', color: Colors.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  doseRow: { paddingVertical: 6, marginBottom: 6 },
  doseChip: { alignItems: 'center', gap: 4, minWidth: 48 },
  doseCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  doseCircleText: { fontWeight: '700', fontSize: 11.5 },
  doseDate: { fontSize: 10, color: Colors.inkSoft },
  doseLine: { width: 14, height: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: -15 },
  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, marginBottom: 10 },
  insightBadge: { backgroundColor: Colors.violetLight, paddingHorizontal: 9, paddingVertical: 2, borderRadius: 10 },
  insightBadgeText: { color: Colors.violet, fontSize: 10.5, fontWeight: '700' },
  insightCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, marginBottom: 10, borderLeftWidth: 4 },
  insightText: { fontSize: 13, color: Colors.ink, lineHeight: 19 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  entryValue: { fontSize: 13.5, fontWeight: '600', color: Colors.ink },
  entryDate: { fontSize: 12, color: Colors.inkSoft, marginTop: 2 },
  entryDelta: { fontSize: 12.5, fontWeight: '600' },
});
