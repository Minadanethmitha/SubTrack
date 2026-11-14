import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { usePreferences } from '../context/PreferencesContext';
import { monthlyEquivalent } from '../utils/billing';
import { formatMoney } from '../utils/money';

export default function BudgetScreen() {
  const { subscriptions } = useSubscriptions();
  const { monthlyBudget, setMonthlyBudget, defaultCurrency } = usePreferences();

  const totalMonthly = subscriptions
    .filter((item) => ['Active', 'Trial'].includes(item.status))
    .reduce((sum, item) => sum + monthlyEquivalent(item.amount, item.billingCycle || 'Monthly'), 0);

  const remaining = monthlyBudget - totalMonthly;
  const percent = monthlyBudget ? Math.min((totalMonthly / monthlyBudget) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget</Text>
      <Text style={styles.label}>Monthly budget</Text>
      <TextInput
        value={String(monthlyBudget || '')}
        onChangeText={(value) => setMonthlyBudget(Number(value) || 0)}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Set budget"
      />

      <View style={styles.card}>
        <Text style={styles.total}>{formatMoney(totalMonthly, defaultCurrency)}</Text>
        <Text style={styles.meta}>{remaining >= 0 ? `${formatMoney(remaining, defaultCurrency)} remaining` : `${formatMoney(Math.abs(remaining), defaultCurrency)} over budget`}</Text>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percent}%` }]} /></View>
      </View>

      <Pressable style={styles.clearButton} onPress={() => setMonthlyBudget(0)}>
        <Text style={styles.clearText}>Clear budget</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F6F7FB' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#DADFEA', padding: 12, fontSize: 16, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#DADFEA', padding: 20 },
  total: { fontSize: 30, fontWeight: '700', color: '#111827' },
  meta: { marginTop: 8, color: '#4B5563' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', backgroundColor: '#4F46E5' },
  clearButton: { marginTop: 16, backgroundColor: '#EEF2FF', borderRadius: 12, padding: 12, alignItems: 'center' },
  clearText: { color: '#111827', fontWeight: '700' },
});
