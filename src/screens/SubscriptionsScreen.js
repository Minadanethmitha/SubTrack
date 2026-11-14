import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatMoney } from '../utils/money';
import { monthlyEquivalent } from '../utils/billing';

const filters = ['All', 'Active', 'Trial', 'Paused', 'Cancelled'];

export default function SubscriptionsScreen({ navigation }) {
  const { subscriptions } = useSubscriptions();
  const { defaultCurrency } = usePreferences();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const visible = useMemo(() => {
    return subscriptions.filter((item) => {
      const matchesStatus = status === 'All' || item.status === status;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || [item.name, item.category, item.notes].join(' ').toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [subscriptions, status, search]);

  const totalMonthly = visible.reduce((sum, item) => sum + monthlyEquivalent(item.amount, item.billingCycle || 'Monthly'), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Subscriptions</Text>
        <Pressable onPress={() => navigation.navigate('AddEditSubscription')} accessibilityRole="button" accessibilityLabel="Add subscription">
          <Ionicons name="add-circle" size={28} color="#4F46E5" />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, category or note"
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search subscriptions"
        />
        {search ? <Ionicons name="close-circle" size={18} color="#6B7280" onPress={() => setSearch('')} /> : null}
      </View>

      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <Pressable key={filter} style={[styles.filterChip, status === filter && styles.filterChipActive]} onPress={() => setStatus(filter)} accessibilityRole="button" accessibilityLabel={`Filter by ${filter}`}>
            <Text style={[styles.filterText, status === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.summary}>{visible.length} subscriptions · {totalMonthly ? formatMoney(totalMonthly, defaultCurrency) : 'No active cost'} · {status}</Text>

      {visible.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No subscriptions match</Text>
          <Text style={styles.emptyText}>Add your first subscription or clear filters.</Text>
        </View>
      ) : (
        visible.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => navigation.navigate('SubscriptionDetails', { subscription: item })} accessibilityRole="button" accessibilityLabel={`Open ${item.name}`}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.category}</Text>
              </View>
              <Text style={styles.amount}>{formatMoney(item.amount, item.currency || defaultCurrency)}</Text>
            </View>
            <Text style={styles.meta}>{item.billingCycle || 'Monthly'} · {item.status}</Text>
            <Text style={styles.meta}>{item.nextBillingDate ? new Date(item.nextBillingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#DADFEA', paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, paddingVertical: 12, fontSize: 14 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterText: { color: '#111827', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  summary: { color: '#4B5563', fontSize: 13, marginBottom: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '600', color: '#111827' },
  meta: { color: '#4B5563', fontSize: 12, marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '700', color: '#111827' },
  emptyState: { marginTop: 24, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#DADFEA' },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: '#4B5563', textAlign: 'center' },
});
