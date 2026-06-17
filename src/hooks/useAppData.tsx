import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Injection, WeightEntry, UserProfile } from '../types';
import { loadData, saveData, defaultData } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AppDataContextType {
  data: AppData;
  loading: boolean;
  addInjection: (injection: Omit<Injection, 'id'>) => void;
  addWeight: (weight: Omit<WeightEntry, 'id'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  sortedInjections: () => Injection[];
  sortedWeights: () => WeightEntry[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then((loaded) => {
      setData(loaded);
      setLoading(false);
    });
  }, []);

  const persist = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const addInjection = useCallback(
    (injection: Omit<Injection, 'id'>) => {
      const newInjection: Injection = { ...injection, id: generateId() };
      const newData = { ...data, injections: [...data.injections, newInjection] };
      persist(newData);
    },
    [data, persist]
  );

  const addWeight = useCallback(
    (weight: Omit<WeightEntry, 'id'>) => {
      const newWeight: WeightEntry = { ...weight, id: generateId() };
      const newData = { ...data, weights: [...data.weights, newWeight] };
      persist(newData);
    },
    [data, persist]
  );

  const updateProfile = useCallback(
    (profileUpdate: Partial<UserProfile>) => {
      const newData = { ...data, profile: { ...data.profile, ...profileUpdate } };
      persist(newData);
    },
    [data, persist]
  );

  const sortedInjections = useCallback(() => {
    return [...data.injections].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [data.injections]);

  const sortedWeights = useCallback(() => {
    return [...data.weights].sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [data.weights]);

  return (
    <AppDataContext.Provider
      value={{
        data,
        loading,
        addInjection,
        addWeight,
        updateProfile,
        sortedInjections,
        sortedWeights,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
