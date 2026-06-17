import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle as SvgCircle, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppData } from '../hooks/useAppData';
import { fmtShort, getDoseColor } from '../utils/helpers';
import { GoalCard } from '../components/GoalCard';

export default function WeightScreen() {
  const colors = useTheme();
  const { data, sortedInjections, sortedWeights } = useAppData();
  const weights = sortedWeights();
  const injections = sortedInjections();
  const injectionsAsc = [...data.injections].sort((a, b) => (a.date < b.date ? -1 : 1));

  if (weights.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bgApp, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.subtitle, { color: colors.inkSoft }]}>No weight data yet. Tap + to log your first weight.</Text>
      </View>
    );
  }

  const first = weights[0];
  const latest = weights[weights.length - 1];
  const totalChange = (latest.value - first.value).toFixed(1);
  const lostSoFar = data.profile.startWeight > 0 ? data.profile.startWeight - latest.value : 0;

  const W = 300, H = 120, pad = 10;
  const vals = weights.map((p) => p.value);
  const dataMin = Math.min(...vals), dataMax = Math.max(...vals);
  const span = dataMax - dataMin || 5;
  let minV = dataMin - 2, maxV = dataMax + 2;
  const goal = data.profile.goalWeight;
  const showGoalLine = goal > 0 && goal >= dataMin - span * 1.5 && goal <= dataMax + span * 1.5;
  if (showGoalLine) { minV = Math.min(minV, goal - 2); maxV = Math.max(maxV, goal + 2); }

  const pts = weights.map((p, i) => ({
    x: pad + (i / (weights.length - 1 || 1)) * (W - 2 * pad),
    y: pad + (1 - (p.value - minV) / (maxV - minV)) * (H - 2 * pad),
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${H - pad} L${pts[0].x.toFixed(1)},${H - pad} Z`;
  const goalY = showGoalLine ? pad + (1 - (goal - minV) / (maxV - minV)) * (H - 2 * pad) : 0;

  const insights = computeInsights(weights, injections, data.profile.goalWeight, colors);
  const weightsDesc = [...weights].reverse();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgApp }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.ink }]}>Progress</Text>
      <Text style={[styles.subtitle, { color: colors.inkSoft }]}>
        {Number(totalChange) < 0 ? 'Down' : 'Up'} {Math.abs(Number(totalChange))} lbs since {fmtShort(first.date)}
      </Text>

      {data.profile.goalWeight > 0 && (
        <GoalCard lostSoFar={lostSoFar} goalWeight={data.profile.goalWeight} startWeight={data.profile.startWeight} currentWeight={latest.value} showDetails />
      )}

      <View style={[styles.chartWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={120}>
          <Path d={areaPath} fill={colors.tealLight} />
          <Path d={linePath} fill="none" stroke={colors.teal} strokeWidth={2.2} />
          {showGoalLine && (
            <>
              <Line x1={pad} y1={goalY} x2={W - pad} y2={goalY} stroke={colors.pink} strokeWidth={1.5} strokeDasharray="4 4" />
              <SvgText x={W - pad} y={goalY - 5} textAnchor="end" fontSize={9.5} fill={colors.pink}>Goal</SvgText>
            </>
          )}
          {pts.map((p, i) => <SvgCircle key={i} cx={p.x} cy={p.y} r={3} fill={colors.teal} />)}
        </Svg>
      </View>

      {injectionsAsc.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.inkSoft }]}>Dose history</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doseRow}>
            {injectionsAsc.map((inj, i) => {
              const c = getDoseColor(inj.dose);
              return (
                <React.Fragment key={inj.id}>
                  <View style={styles.doseChip}>
                    <View style={[styles.doseCircle, { backgroundColor: c.bg }]}>
                      <Text style={[styles.doseCircleText, { color: c.fg }]}>{inj.dose.replace(' mg', '')}</Text>
                    </View>
                    <Text style={[styles.doseDate, { color: colors.inkSoft }]}>{fmtShort(inj.date)}</Text>
                  </View>
                  {i < injectionsAsc.length - 1 && <View style={[styles.doseLine, { backgroundColor: colors.border }]} />}
                </React.Fragment>
              );
            })}
          </ScrollView>
        </>
      )}

      {insights.length > 0 && (
        <>
          <View style={styles.insightHead}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.violet} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
            </Svg>
            <Text style={[styles.sectionLabel, { color: colors.inkSoft, marginBottom: 0 }]}>Insights</Text>
            <View style={[styles.insightBadge, { backgroundColor: colors.violetLight }]}>
              <Text style={[styles.insightBadgeText, { color: colors.violet }]}>smart</Text>
            </View>
          </View>
          {insights.map((ins, i) => (
            <View key={i} style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: ins.color }]}>
              <Text style={[styles.insightText, { color: colors.ink }]}>{ins.text}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={[styles.sectionLabel, { color: colors.inkSoft, marginTop: 18 }]}>History</Text>
      {weightsDesc.map((w, i) => {
        const prev = weightsDesc[i + 1];
        const d = prev ? w.value - prev.value : 0;
        const dText = prev ? (d === 0 ? 'no change' : `${d < 0 ? '\u25BC' : '\u25B2'} ${Math.abs(d).toFixed(1)} lbs`) : '';
        return (
          <View key={w.id} style={[styles.entryRow, { borderBottomColor: colors.border }, i === weightsDesc.length - 1 && { borderBottomWidth: 0 }]}>
            <View>
              <Text style={[styles.entryValue, { color: colors.ink }]}>{w.value} lbs</Text>
              <Text style={[styles.entryDate, { color: colors.inkSoft }]}>{fmtShort(w.date)}</Text>
            </View>
            <Text style={[styles.entryDelta, { color: d < 0 ? colors.teal : d > 0 ? colors.coral : colors.inkSoft }]}>{dText}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function computeInsights(weights: any[], injections: any[], goalWeight: number, colors: any) {
  const out: { color: string; text: string }[] = [];
  if (weights.length >= 2) {
    const recent = weights.slice(-Math.min(4, weights.length));
    const newest = recent[recent.length - 1], oldest = recent[0];
    const daysSpan = (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / 86400000;
    const weeksSpan = daysSpan / 7 || 1;
    const rate = (newest.value - oldest.value) / weeksSpan;
    if (rate < -0.1) {
      out.push({ color: colors.green, text: `You are averaging about ${Math.abs(rate).toFixed(1)} lbs lost per week \u2014 a steady, sustainable pace.` });
      if (goalWeight > 0) {
        const remaining = newest.value - goalWeight;
        if (remaining > 0) { out.push({ color: colors.violet, text: `At this pace, you could reach your ${goalWeight} lb goal in roughly ${Math.round(remaining / Math.abs(rate))} more weeks.` }); }
      }
    } else if (rate > 0.1) {
      out.push({ color: colors.amber, text: 'Weight has ticked up slightly over your last few entries.' });
    } else {
      out.push({ color: colors.violet, text: 'Your weight has been holding fairly steady over recent entries.' });
    }
  }
  if (injections.length >= 2) {
    const latestDose = parseFloat(injections[0].dose), prevDose = parseFloat(injections[1].dose);
    if (latestDose > prevDose) { out.push({ color: colors.violet, text: `Your dose stepped up from ${injections[1].dose} to ${injections[0].dose} \u2014 many people see loss accelerate after a step up.` }); }
  }
  return out.slice(0, 3);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 21, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 18 },
  chartWrap: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16 },
  sectionLabel: { fontSize: 12.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  doseRow: { paddingVertical: 6, marginBottom: 6 },
  doseChip: { alignItems: 'center', gap: 4, minWidth: 48 },
  doseCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  doseCircleText: { fontWeight: '700', fontSize: 11.5 },
  doseDate: { fontSize: 10 },
  doseLine: { width: 14, height: 2, alignSelf: 'center', marginTop: -15 },
  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, marginBottom: 10 },
  insightBadge: { paddingHorizontal: 9, paddingVertical: 2, borderRadius: 10 },
  insightBadgeText: { fontSize: 10.5, fontWeight: '700' },
  insightCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10, borderLeftWidth: 4 },
  insightText: { fontSize: 13, lineHeight: 19 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  entryValue: { fontSize: 13.5, fontWeight: '600' },
  entryDate: { fontSize: 12, marginTop: 2 },
  entryDelta: { fontSize: 12.5, fontWeight: '600' },
});
