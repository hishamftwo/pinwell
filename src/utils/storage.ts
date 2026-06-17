import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';

const STORAGE_KEY = '@glp1_tracker_data';

export const defaultData: AppData = {
  injections: [],
  weights: [],
  profile: {
    startWeight: 0,
    goalWeight: 0,
    reminderEnabled: true,
    reminderTime: '09:00',
    weightUnit: 'lbs',
    darkMode: false,
  },
};

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json) as AppData;
      // Ensure darkMode field exists for older saved data
      if (parsed.profile.darkMode === undefined) {
        parsed.profile.darkMode = false;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load data', e);
  }
  return defaultData;
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}
