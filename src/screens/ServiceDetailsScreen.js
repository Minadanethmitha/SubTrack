import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import services from '../data/services.json';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { formatMoney } from '../utils/money';

export default function ServiceDetailsScreen({ route, navigation }) {
  const { service } = route.params || {};
  const { subscriptions } = useSubscriptions();

  const similar = useMemo(
    () => services.filter((item) => item.category === service?.category && item.id !== service?.id).slice(0, 3),
    [service],
  );

  const tracking = subscriptions.some((item) => item.catalogId === service?.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{service?.name || 'Service details'}</Text>
      <Text style={styles.meta}>{service?.category}</Text>
      <Text style={styles.description}>{service?.description}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Typical plans</Text>
        {service?.typicalPlans?.map((plan) => (
          <View key={plan.planName} style={styles.planRow}>
            <Text style={styles.planName}>{plan.planName}</Text>
            <Text style={styles.planPrice}>{formatMoney(plan.priceUSD, 'USD')}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Free trial</Text>
        <Text style={styles.info}>{service?.freeTrial ? 'Yes, a trial is often available.' : 'No free trial listed in the sample catalog.'}</Text>
        <Text style={styles.sectionTitle}>Cancel difficulty</Text>
        <Text style={styles.info}>{service?.cancelDifficulty}</Text>
        <Text style={styles.sectionTitle}>Cancel tip</Text>
        <Text style={styles.info}>{service?.cancelTip}</Text>
        <Text style={styles.sectionTitle}>Saving tip</Text>
        <Text style={styles.info}>{service?.savingTip}</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('AddEditSubscription', { service })} accessibilityRole="button" accessibilityLabel={`Track ${service?.name}`}>
        <Text style={styles.primaryText}>{tracking ? 'Already tracking' : 'Track this service'}</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Similar services</Text>
        {similar.map((item) => (
          <Pressable key={item.id} onPress={() => navigation.push('ServiceDetails', { service: item })}>
            <Text style={styles.similar}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  meta: { color: '#4B5563', marginTop: 8, marginBottom: 8 },
  description: { color: '#4B5563', lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  planName: { color: '#111827' },
  planPrice: { color: '#111827', fontWeight: '600' },
  info: { color: '#4B5563', marginBottom: 12, lineHeight: 20 },
  primaryButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  similar: { paddingVertical: 8, color: '#111827', fontWeight: '600' },
});
