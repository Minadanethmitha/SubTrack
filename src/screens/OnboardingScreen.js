import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences } from '../context/PreferencesContext';

const slides = [
  { icon: 'albums', title: 'Track everything', text: 'See subscriptions, utility bills, and recurring payments in one place.' },
  { icon: 'calendar', title: 'Never miss a payment', text: 'Check what is due soon and keep your next billing dates visible.' },
  { icon: 'wallet', title: 'Save money', text: 'Spot duplicate services and understand your real monthly cost.' },
];

const currencies = ['LKR', 'USD', 'EUR', 'GBP', 'INR'];

export default function OnboardingScreen({ navigation }) {
  const { setDefaultCurrency, setMonthlyBudget, setOnboardingComplete } = usePreferences();
  const [currency, setCurrency] = useState('LKR');
  const [budget, setBudget] = useState('0');

  const continueToApp = () => {
    setDefaultCurrency(currency);
    setMonthlyBudget(Number(budget) || 0);
    setOnboardingComplete(true);
    navigation.replace('MainTabs');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>SubTrack</Text>
      <Text style={styles.subtitle}>Offline subscription tracking, made simple.</Text>

      {slides.map((slide) => (
        <View key={slide.title} style={styles.slideCard}>
          <Ionicons name={slide.icon} size={28} color="#4F46E5" />
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideText}>{slide.text}</Text>
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.label}>Default currency</Text>
        <View style={styles.currencyRow}>
          {currencies.map((item) => (
            <Pressable
              key={item}
              style={[styles.currencyChip, currency === item && styles.currencyChipActive]}
              onPress={() => setCurrency(item)}
              accessibilityRole="button"
              accessibilityLabel={`Set currency ${item}`}
            >
              <Text style={[styles.currencyText, currency === item && styles.currencyTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Monthly budget (optional)</Text>
        <TextInput
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholder="0"
          style={styles.input}
          accessibilityLabel="Monthly budget"
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={continueToApp} accessibilityRole="button" accessibilityLabel="Continue to app">
        <Text style={styles.primaryText}>Get started</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F6F7FB', padding: 24, paddingTop: 60 },
  brand: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#4B5563', marginBottom: 20 },
  slideCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#DADFEA' },
  slideTitle: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  slideText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  section: { marginTop: 8, marginBottom: 18 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#DADFEA' },
  currencyChipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  currencyText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  currencyTextActive: { color: '#FFFFFF' },
  input: { backgroundColor: '#FFFFFF', borderColor: '#DADFEA', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
  primaryButton: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  primaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
