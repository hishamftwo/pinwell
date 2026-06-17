import { useAppData } from './useAppData';
import { getColors, ThemeColors } from '../constants/theme';

export function useTheme(): ThemeColors {
  const { data } = useAppData();
  return getColors(data.profile.darkMode);
}
