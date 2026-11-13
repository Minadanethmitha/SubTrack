import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences } from '../context/PreferencesContext';

const currencies = ['LKR', 'USD', 'EUR', 'GBP', 'INR'];

export default function SettingsScreen({ navigation }) {
  const { defaultCurrency, setDefaultCurrency, theme, setTheme, hapticsEnabled, setHapticsEnabled } = usePreferences();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Default currency</Text>
        <View style={styles.rowWrap}>
          {currencies.map((currency) => (
            <Pressable key={currency} style={[styles.chip, defaultCurrency === currency && styles.chipActive]} onPress={() => setDefaultCurrency(currency)}>
              <Text style={[styles.chipText, defaultCurrency === currency && styles.chipTextActive]}>{currency}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.rowWrap}>
          {['system', 'light', 'dark'].map((mode) => (
            <Pressable key={mode} style={[styles.chip, theme === mode && styles.chipActive]} onPress={() => setTheme(mode)}>
              <Text style={[styles.chipText, theme === mode && styles.chipTextActive]}>{mode}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={styles.rowItem} onPress={() => setHapticsEnabled(!hapticsEnabled)}>
        <Text style={styles.rowText}>Haptics</Text>
        <Text style={styles.rowValue}>{hapticsEnabled ? 'On' : 'Off'}</Text>
      </Pressable>

      <Pressable style={styles.rowItem} onPress={() => navigation.navigate('Budget')}>
        <Text style={styles.rowText}>Budget</Text>
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </Pressable>

      <Pressable style={styles.rowItem} onPress={() => navigation.navigate('HelpAbout')}>
        <Text style={styles.rowText}>How to use</Text>
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#DADFEA', padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  chipActive: { backgroundColor: '#4F46E5' },
  chipText: { color: '#111827', fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#FFFFFF' },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#DADFEA', padding: 16, marginBottom: 10 },
  rowText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  rowValue: { color: '#4B5563', fontSize: 14 },
});
