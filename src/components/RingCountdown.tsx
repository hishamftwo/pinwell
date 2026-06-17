import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface RingCountdownProps {
  daysUntil: number;
}

export function RingCountdown({ daysUntil }: RingCountdownProps) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const overdue = daysUntil < 0;
  const dueToday = daysUntil === 0;
  let pct = (7 - Math.max(0, Math.min(7, daysUntil))) / 7;
  if (overdue) pct = 1;
  const offset = c * (1 - pct);

  let bigText: string;
  let smallText: string;

  if (overdue) {
    bigText = 'Overdue';
    smallText = `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} late`;
  } else if (dueToday) {
    bigText = 'Today';
    smallText = 'dose is due';
  } else {
    bigText = String(daysUntil);
    smallText = `day${daysUntil === 1 ? '' : 's'} until next dose`;
  }

  return (
    <View style={styles.container}>
      <Svg width={140} height={140} viewBox="0 0 140 140">
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.teal} />
            <Stop offset="100%" stopColor={Colors.green} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={70}
          cy={70}
          r={r}
          fill="none"
          stroke={Colors.border}
          strokeWidth={10}
        />
        <Circle
          cx={70}
          cy={70}
          r={r}
          fill="none"
          stroke={overdue ? Colors.coral : 'url(#ringGrad)'}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${c.toFixed(1)}`}
          strokeDashoffset={`${offset.toFixed(1)}`}
          rotation={-90}
          origin="70, 70"
        />
      </Svg>
      <View style={styles.textOverlay}>
        <Text
          style={[
            styles.bigText,
            { color: overdue ? Colors.coral : Colors.ink, fontSize: overdue ? 18 : 30 },
          ]}
        >
          {bigText}
        </Text>
        <Text style={styles.smallText}>{smallText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  bigText: {
    fontWeight: '800',
  },
  smallText: {
    fontSize: 10.5,
    color: Colors.inkSoft,
    marginTop: 2,
  },
});
