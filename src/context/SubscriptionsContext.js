import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../storage/keys';
import { nextBillingDate } from '../utils/billing';

const SubscriptionsContext = createContext();

export const SubscriptionsProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [paymentLog, setPaymentLog] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [hintFlags, setHintFlags] = useState({});
  const [budget, setBudget] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [subs, logs, searches, hints, budgetValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.subscriptions),
          AsyncStorage.getItem(STORAGE_KEYS.paymentLog),
          AsyncStorage.getItem(STORAGE_KEYS.recentSearches),
          AsyncStorage.getItem(STORAGE_KEYS.hintFlags),
          AsyncStorage.getItem(STORAGE_KEYS.budget),
        ]);

        setSubscriptions(subs ? JSON.parse(subs) : []);
        setPaymentLog(logs ? JSON.parse(logs) : []);
        setRecentSearches(searches ? JSON.parse(searches) : []);
        setHintFlags(hints ? JSON.parse(hints) : {});
        setBudget(Number(budgetValue || 0));
      } catch (error) {
        console.error('Subscription storage load failed', error);
      } finally {
        setReady(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(subscriptions));
        await AsyncStorage.setItem(STORAGE_KEYS.paymentLog, JSON.stringify(paymentLog));
        await AsyncStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(recentSearches));
        await AsyncStorage.setItem(STORAGE_KEYS.hintFlags, JSON.stringify(hintFlags));
        await AsyncStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(budget));
      } catch (error) {
        console.error('Subscription storage save failed', error);
      }
    };
    save();
  }, [subscriptions, paymentLog, recentSearches, hintFlags, budget, ready]);

  const addSubscription = (entry) => {
    setSubscriptions((current) => [entry, ...current]);
  };

  const updateSubscription = (id, updated) => {
    setSubscriptions((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteSubscription = (id) => {
    setSubscriptions((current) => current.filter((item) => item.id !== id));
    setPaymentLog((current) => current.filter((item) => item.subscriptionId !== id));
  };

  const markAsPaid = (subscriptionId) => {
    setSubscriptions((current) =>
      current.map((item) => {
        if (item.id !== subscriptionId) return item;
        const nextDate = nextBillingDate(item.nextBillingDate || item.startDate, item.billingCycle || 'Monthly');
        return { ...item, nextBillingDate: nextDate.toISOString() };
      }),
    );

    setPaymentLog((current) => [
      ...current,
      {
        id: String(Date.now()),
        subscriptionId,
        amount: 0,
        currency: 'USD',
        paidOn: new Date().toISOString(),
      },
    ]);
  };

  const value = useMemo(
    () => ({
      subscriptions,
      paymentLog,
      recentSearches,
      hintFlags,
      budget,
      ready,
      setSubscriptions,
      setPaymentLog,
      setRecentSearches,
      setHintFlags,
      setBudget,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      markAsPaid,
    }),
    [subscriptions, paymentLog, recentSearches, hintFlags, budget, ready],
  );

  return <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>;
};

export const useSubscriptions = () => useContext(SubscriptionsContext);
