export interface Injection {
  id: string;
  date: string; // YYYY-MM-DD
  dose: string; // e.g. '7.5 mg'
  site: string; // e.g. 'Abdomen', 'Thigh', 'Upper arm'
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: number; // in lbs
}

export interface UserProfile {
  startWeight: number;
  goalWeight: number;
  reminderEnabled: boolean;
  reminderTime: string; // e.g. '09:00'
  weightUnit: 'lbs' | 'kg';
}

export interface AppData {
  injections: Injection[];
  weights: WeightEntry[];
  profile: UserProfile;
}
