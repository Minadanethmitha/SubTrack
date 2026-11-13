import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { usePreferences } from '../context/PreferencesContext';
import { monthlyEquivalent } from '../utils/billing';
import { formatMoney } from '../utils/money';

export default function HomeScreen({ navigation }) {
  const { subscriptions } = useSubscriptions();
  const { defaultCurrency, monthlyBudget } = usePreferences();

  const active = useMemo(
    () => subscriptions.filter((item) => ['Active', 'Trial'].includes(item.status)),
    [subscriptions],
  );

  const totalMonthly = active.reduce((sum, item) => sum + monthlyEquivalent(item.amount, item.billingCycle || 'Monthly'), 0);
  const totalYearly = totalMonthly * 12;
  const budgetUsed = monthlyBudget > 0 ? Math.min((totalMonthly / monthlyBudget) * 100, 100) : 0;

  const dueSoon = active
    .filter((item) => item.nextBillingDate)
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate))
    .slice(0, 3);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.greeting}>Hello</Text>
        <View style={styles.offlineBadge}><Text style={styles.offlineText}>Offline</Text></View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.cardLabel}>Total monthly cost</Text>
        <Text style={styles.total}>{formatMoney(totalMonthly, defaultCurrency)}</Text>
        <Text style={styles.subtle}>Yearly: {formatMoney(totalYearly, defaultCurrency)}</Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Monthly budget</Text>
          <Text style={styles.muted}>{monthlyBudget ? formatMoney(Math.min(totalMonthly, monthlyBudget), defaultCurrency) + ' / ' + formatMoney(monthlyBudget, defaultCurrency) : 'No budget set'}</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${budgetUsed}%` }]} /></View>
        <Text style={styles.muted}>{budgetUsed > 100 ? 'Over budget' : `${Math.round(budgetUsed || 0)}% used`}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Due in the next 7 days</Text>
        {dueSoon.length === 0 ? (
          <Text style={styles.emptyText}>No subscriptions due soon.</Text>
        ) : (
          dueSoon.map((item) => (
            <View key={item.id} style={styles.listRow}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.muted}>{item.billingCycle || 'Monthly'} · {formatMoney(item.amount, item.currency || defaultCurrency)}</Text>
              </View>
              <Text style={styles.itemMeta}>{item.nextBillingDate ? new Date(item.nextBillingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Soon'}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('AddEditSubscription')} accessibilityRole="button" accessibilityLabel="Add subscription">
          <Ionicons name="add-circle" size={20} color="#4F46E5" />
          <Text style={styles.actionText}>Add</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Explore')} accessibilityRole="button" accessibilityLabel="Explore services">
          <Ionicons name="search" size={20} color="#4F46E5" />
          <Text style={styles.actionText}>Explore</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Insights')} accessibilityRole="button" accessibilityLabel="View insights">
          <Ionicons name="bar-chart" size={20} color="#4F46E5" />
          <Text style={styles.actionText}>Insights</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  container: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 28, fontWeight: '700', color: '#111827' },
  offlineBadge: { backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  offlineText: { color: '#15803D', fontWeight: '600', fontSize: 12 },
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#DADFEA', marginBottom: 16 },
  cardLabel: { color: '#4B5563', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  total: { fontSize: 32, fontWeight: '700', color: '#111827', marginTop: 8 },
  subtle: { marginTop: 8, color: '#4B5563', fontSize: 14 },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  muted: { color: '#4B5563', fontSize: 12 },
  progressTrack: { backgroundColor: '#E5E7EB', height: 10, borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  progressFill: { backgroundColor: '#4F46E5', height: '100%' },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: '#4F46E5', marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  itemMeta: { fontSize: 12, color: '#4B5563' },
  emptyText: { color: '#4B5563' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  actionButton: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#DADFEA', marginHorizontal: 4 },
  actionText: { color: '#111827', fontWeight: '600', marginTop: 6 },
});
