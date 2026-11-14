import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { usePreferences } from '../context/PreferencesContext';

const categories = ['Streaming', 'Music', 'Gaming', 'Cloud & Storage', 'Software & Productivity', 'Education', 'News & Reading', 'Fitness & Health', 'Utilities & Bills', 'Finance & Insurance', 'Shopping & Delivery', 'Other'];
const cycles = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const statuses = ['Active', 'Trial', 'Paused', 'Cancelled'];
const paymentMethods = ['Card', 'Cash', 'Bank', 'Mobile wallet', 'Other'];

export default function AddEditSubscriptionScreen({ route, navigation }) {
  const { addSubscription } = useSubscriptions();
  const { defaultCurrency } = usePreferences();
  const service = route.params?.service;

  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState(service?.category || categories[0]);
  const [amount, setAmount] = useState(String(service?.typicalPlans?.[0]?.priceUSD || '9.99'));
  const [currency, setCurrency] = useState(defaultCurrency);
  const [billingCycle, setBillingCycle] = useState(service?.typicalPlans?.[0]?.cycle || 'Monthly');
  const [status, setStatus] = useState('Active');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [notes, setNotes] = useState('');

  const nextBillingDate = useMemo(() => {
    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return base.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  const save = () => {
    if (!name.trim() || Number(amount) <= 0) {
      return;
    }

    addSubscription({
      id: `sub-${Date.now()}`,
      name: name.trim(),
      catalogId: service?.id || null,
      category,
      amount: Number(amount),
      currency,
      billingCycle,
      startDate: new Date().toISOString(),
      nextBillingDate: new Date().toISOString(),
      paymentMethod,
      status,
      reminderDaysBefore: 3,
      notes: notes.trim().slice(0, 500),
      createdAt: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{service ? 'Track service' : 'Add subscription'}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="e.g. Spotify Premium" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipWrap}>
        {categories.map((item) => (
          <Pressable key={item} style={[styles.chip, category === item && styles.chipActive]} onPress={() => setCategory(item)}>
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput value={amount} onChangeText={setAmount} style={styles.input} keyboardType="decimal-pad" />

      <Text style={styles.label}>Currency</Text>
      <View style={styles.chipWrap}>
        {['LKR', 'USD', 'EUR', 'GBP', 'INR'].map((item) => (
          <Pressable key={item} style={[styles.chip, currency === item && styles.chipActive]} onPress={() => setCurrency(item)}>
            <Text style={[styles.chipText, currency === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Billing cycle</Text>
      <View style={styles.chipWrap}>
        {cycles.map((item) => (
          <Pressable key={item} style={[styles.chip, billingCycle === item && styles.chipActive]} onPress={() => setBillingCycle(item)}>
            <Text style={[styles.chipText, billingCycle === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Status</Text>
      <View style={styles.chipWrap}>
        {statuses.map((item) => (
          <Pressable key={item} style={[styles.chip, status === item && styles.chipActive]} onPress={() => setStatus(item)}>
            <Text style={[styles.chipText, status === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Payment method</Text>
      <View style={styles.chipWrap}>
        {paymentMethods.map((item) => (
          <Pressable key={item} style={[styles.chip, paymentMethod === item && styles.chipActive]} onPress={() => setPaymentMethod(item)}>
            <Text style={[styles.chipText, paymentMethod === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} style={[styles.input, styles.multiLine]} multiline numberOfLines={4} />
      <Text style={styles.preview}>Next payment: {nextBillingDate}</Text>

      <Pressable style={styles.primaryButton} onPress={save} accessibilityRole="button" accessibilityLabel="Save subscription">
        <Text style={styles.primaryText}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8, marginTop: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#DADFEA', padding: 12, fontSize: 16 },
  multiLine: { minHeight: 100, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#4F46E5' },
  chipText: { color: '#111827', fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#FFFFFF' },
  preview: { color: '#4B5563', marginTop: 12, marginBottom: 12, fontSize: 14 },
  primaryButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  primaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
