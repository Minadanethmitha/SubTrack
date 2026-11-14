import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';
import SubscriptionDetailsScreen from '../screens/SubscriptionDetailsScreen';
import AddEditSubscriptionScreen from '../screens/AddEditSubscriptionScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import HelpAboutScreen from '../screens/HelpAboutScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import { usePreferences } from '../context/PreferencesContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { onboardingComplete } = usePreferences();

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={onboardingComplete ? 'MainTabs' : 'Onboarding'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />
          <Stack.Screen name="AddEditSubscription" component={AddEditSubscriptionScreen} />
          <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
          <Stack.Screen name="Budget" component={BudgetScreen} />
          <Stack.Screen name="HelpAbout" component={HelpAboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
