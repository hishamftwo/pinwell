export const LightColors = {
  bgPage: '#EAF6F1',
  bgApp: '#FBFDFC',
  ink: '#1B2B29',
  inkSoft: '#5C6F69',
  teal: '#1F6F64',
  tealLight: '#DCEFEA',
  coral: '#E8735C',
  coralLight: '#FBE6E1',
  amber: '#D9A441',
  amberLight: '#F7ECD7',
  green: '#34B774',
  greenLight: '#E3F7EC',
  violet: '#8B5CF6',
  violetLight: '#EFEAFD',
  pink: '#EC4899',
  pinkLight: '#FDEAF2',
  blue: '#3B82F6',
  blueLight: '#E8F1FE',
  card: '#FFFFFF',
  border: '#E1E8E4',
};

export const DarkColors = {
  bgPage: '#0F1A17',
  bgApp: '#151F1C',
  ink: '#E8F0ED',
  inkSoft: '#9BABA5',
  teal: '#3DD9C4',
  tealLight: '#1A3530',
  coral: '#F28B76',
  coralLight: '#3D2220',
  amber: '#F0BB5C',
  amberLight: '#3D3018',
  green: '#4CE68E',
  greenLight: '#1A3525',
  violet: '#A78BFA',
  violetLight: '#2D2450',
  pink: '#F472B6',
  pinkLight: '#3D1A30',
  blue: '#60A5FA',
  blueLight: '#1A2840',
  card: '#1C2A26',
  border: '#2D3D38',
};

// Default export for backward compatibility
export const Colors = LightColors;

export type ThemeColors = typeof LightColors;

export function getColors(darkMode: boolean): ThemeColors {
  return darkMode ? DarkColors : LightColors;
}

export const FontSizes = {
  xs: 10.5,
  sm: 12,
  smPlus: 12.5,
  md: 13,
  mdPlus: 13.5,
  base: 14,
  lg: 15,
  xl: 17,
  xxl: 21,
  xxxl: 26,
  huge: 30,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BorderRadius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 24,
  full: 50,
};
