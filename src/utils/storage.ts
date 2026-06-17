import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';
import { ymd, addDays, generateId } from './helpers';

const STORAGE_KEY = '@glp1_tracker_data';

const today = new Date();

export const defaultData: AppData = {
  injections: [
    { id: generateId(), date: ymd(addDays(today, -3)), dose: '7.5 mg', site: 'Abdomen' },
    { id: generateId(), date: ymd(addDays(today, -10)), dose: '5 mg', site: 'Thigh' },
    { id: generateId(), date: ymd(addDays(today, -17)), dose: '5 mg', site: 'Upper arm' },
    { id: generateId(), date: ymd(addDays(today, -24)), dose: '2.5 mg', site: 'Abdomen' },
  ],
  weights: [
    { id: generateId(), date: ymd(addDays(today, -24)), value: 212 },
    { id: generateId(), date: ymd(addDays(today, -17)), value: 209.4 },
    { id: generateId(), date: ymd(addDays(today, -10)), value: 206.8 },
    { id: generateId(), date: ymd(addDays(today, -3)), value: 203.5 },
    { id: generateId(), date: ymd(today), value: 201.2 },
  ],
  profile: {
    startWeight: 212,
    goalWeight: 190,
    reminderEnabled: true,
    reminderTime: '09:00',
    weightUnit: 'lbs',
  },
};

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as AppData;
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
