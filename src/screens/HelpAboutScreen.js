import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import services from '../data/services.json';
import { appInfo } from '../constants/appInfo';

export default function HelpAboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & About</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How to use SubTrack</Text>
        {[1, 2, 3, 4, 5].map((step) => (
          <Text key={step} style={styles.step}>{`${step}. ${[
            'Set your default currency.',
            'Add subscriptions from your catalog or custom entries.',
            'Check what is due soon or trial-ending.',
            'Review your insights and monthly budget.',
            'Save money by comparing recurring plans.',
          ][step - 1]}`}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Offline-first</Text>
        <Text style={styles.text}>All catalog data is bundled locally and your personal subscriptions are stored on your device only.</Text>
        <Text style={styles.text}>Catalog prices are sample prices and should be checked with the provider.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Student details</Text>
        <Text style={styles.text}>{appInfo.studentName}</Text>
        <Text style={styles.text}>{appInfo.indexNumber}</Text>
        <Text style={styles.text}>{appInfo.moduleName}</Text>
        <Text style={styles.text}>App version {appInfo.appVersion}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Counts</Text>
        <Text style={styles.text}>Catalog services: {services.length}</Text>
        <Text style={styles.text}>Categories: {new Set(services.map((item) => item.category)).size}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DADFEA', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  step: { color: '#4B5563', marginBottom: 8, lineHeight: 22 },
  text: { color: '#4B5563', marginBottom: 6, lineHeight: 22 },
});
