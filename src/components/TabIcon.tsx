import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface TabIconProps {
  name: 'home' | 'calendar' | 'weight' | 'settings';
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 22 }: TabIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'home':
      return (
        <Svg {...props}>
          <Path d="M4 11.5 12 4l8 7.5" />
          <Path d="M6 10v9.5a.5.5 0 0 0 .5.5H10v-6h4v6h3.5a.5.5 0 0 0 .5-.5V10" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...props}>
          <Rect x={4} y={6} width={16} height={14} rx={2} />
          <Path d="M8 4v4M16 4v4M4 10h16" />
        </Svg>
      );
    case 'weight':
      return (
        <Svg {...props}>
          <Circle cx={12} cy={13} r={7} />
          <Path d="M9.5 4.5h5M12 9v4l2.5 2" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg {...props}>
          <Path d="M5 7h9M5 12h14M5 17h9" />
          <Circle cx={17} cy={7} r={1.6} />
          <Circle cx={9} cy={17} r={1.6} />
        </Svg>
      );
    default:
      return null;
  }
}
