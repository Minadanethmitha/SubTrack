import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { formatMoney } from '../utils/money';
import { monthlyEquivalent } from '../utils/billing';

export default function SubscriptionDetailsScreen({ route, navigation }) {
  const { subscription } = route.params || {};
  const { deleteSubscription, markAsPaid, updateSubscription, paymentLog } = useSubscriptions();

  const relatedLogs = paymentLog.filter((item) => item.subscriptionId === subscription?.id);

  const handleDelete = () => {
    Alert.alert('Delete subscription', 'This will remove the subscription and related payment history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteSubscription(subscription.id); navigation.goBack(); } },
    ]);
  };

  const handleMarkPaid = () => {
    markAsPaid(subscription.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{subscription?.name}</Text>
      <Text style={styles.meta}>{subscription?.category} · {subscription?.status}</Text>
      <Text style={styles.amount}>{formatMoney(subscription?.amount || 0, subscription?.currency || 'USD')}</Text>
      <Text style={styles.meta}>{subscription?.billingCycle || 'Monthly'} cycle</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Monthly equivalent</Text>
        <Text style={styles.value}>{formatMoney(monthlyEquivalent(subscription?.amount || 0, subscription?.billingCycle || 'Monthly'), subscription?.currency || 'USD')}</Text>
        <Text style={styles.sectionTitle}>Next billing date</Text>
        <Text style={styles.value}>{subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={handleMarkPaid}><Text style={styles.primaryText}>Mark as paid</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('AddEditSubscription', { subscription })}><Text style={styles.secondaryText}>Edit</Text></Pressable>
      </View>

      <Pressable style={styles.dangerButton} onPress={handleDelete}><Text style={styles.dangerText}>Delete</Text></Pressable>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment history</Text>
        {relatedLogs.length === 0 ? (
          <Text style={styles.meta}>No payments recorded yet.</Text>
        ) : (
          relatedLogs.map((log) => (
            <Text key={log.id} style={styles.meta}>{new Date(log.paidOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {formatMoney(log.amount || 0, log.currency || 'USD')}</Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  meta: { color: '#4B5563', marginTop: 8 },
  amount: { fontSize: 28, fontWeight: '700', marginTop: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  value: { color: '#111827', fontWeight: '600', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 8 },
  primaryButton: { flex: 1, backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  secondaryButton: { flex: 1, backgroundColor: '#EEF2FF', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: '#111827', fontWeight: '700' },
  dangerButton: { backgroundColor: '#FEE2E2', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  dangerText: { color: '#B42318', fontWeight: '700' },
});
