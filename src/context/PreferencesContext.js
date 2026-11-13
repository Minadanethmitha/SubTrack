import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    defaultCurrency: 'LKR',
    monthlyBudget: 0,
    theme: 'system',
    hapticsEnabled: true,
    defaultReminderDays: 3,
    onboardingComplete: false,
    showHintCard: true,
    recentSearches: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.preferences);
        if (raw) {
          const parsed = JSON.parse(raw);
          setPreferences((current) => ({ ...current, ...parsed }));
        }
      } catch (error) {
        console.error('Preferences load failed', error);
      } finally {
        setReady(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
      } catch (error) {
        console.error('Preferences save failed', error);
      }
    };
    save();
  }, [preferences, ready]);

  const value = useMemo(
    () => ({
      ...preferences,
      ready,
      setDefaultCurrency: (currency) => setPreferences((prev) => ({ ...prev, defaultCurrency: currency })),
      setMonthlyBudget: (amount) => setPreferences((prev) => ({ ...prev, monthlyBudget: amount })),
      setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
      setHapticsEnabled: (enabled) => setPreferences((prev) => ({ ...prev, hapticsEnabled: enabled })),
      setDefaultReminderDays: (days) => setPreferences((prev) => ({ ...prev, defaultReminderDays: days })),
      setOnboardingComplete: (value) => setPreferences((prev) => ({ ...prev, onboardingComplete: value })),
      setShowHintCard: (value) => setPreferences((prev) => ({ ...prev, showHintCard: value })),
      addRecentSearch: (term) => {
        const trimmed = String(term || '').trim();
        if (!trimmed) return;
        setPreferences((prev) => ({
          ...prev,
          recentSearches: [trimmed, ...prev.recentSearches.filter((item) => item !== trimmed)].slice(0, 5),
        }));
      },
      clearRecentSearches: () => setPreferences((prev) => ({ ...prev, recentSearches: [] })),
    }),
    [preferences, ready],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = () => useContext(PreferencesContext);
