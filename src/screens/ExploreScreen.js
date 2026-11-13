import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import services from '../data/services.json';
import { usePreferences } from '../context/PreferencesContext';
import { formatMoney } from '../utils/money';

const categories = ['All', ...new Set(services.map((item) => item.category))];

export default function ExploreScreen({ navigation }) {
  const { defaultCurrency } = usePreferences();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const text = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
      const matchesText = !query || text.includes(query.trim().toLowerCase());
      return matchesCategory && matchesText;
    });
  }, [category, query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search services"
          style={styles.searchInput}
          accessibilityLabel="Search service catalog"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {categories.map((item) => (
          <Pressable key={item} style={[styles.categoryChip, category === item && styles.categoryChipActive]} onPress={() => setCategory(item)} accessibilityRole="button" accessibilityLabel={`Filter by ${item}`}>
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}><Text style={styles.emptyTitle}>No service matches</Text></View>
      ) : (
        filtered.map((service) => (
          <Pressable key={service.id} style={styles.card} onPress={() => navigation.navigate('ServiceDetails', { service })} accessibilityRole="button" accessibilityLabel={`Open ${service.name}`}>
            <Text style={styles.name}>{service.name}</Text>
            <Text style={styles.meta}>{service.category}</Text>
            <Text style={styles.description}>{service.description}</Text>
            <Text style={styles.price}>{formatMoney(service.typicalPlans[0]?.priceUSD || 0, defaultCurrency)} starting</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#DADFEA', paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 8, fontSize: 14 },
  categoryBar: { marginBottom: 12 },
  categoryChip: { backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#4F46E5' },
  categoryText: { color: '#111827', fontSize: 12, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  meta: { color: '#4B5563', fontSize: 12, marginTop: 4 },
  description: { color: '#4B5563', marginTop: 8, lineHeight: 20 },
  price: { color: '#4F46E5', fontWeight: '700', marginTop: 10 },
  emptyState: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#DADFEA', alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
});
