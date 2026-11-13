import { monthlyEquivalent, yearlyEquivalent } from './billing';

export const computeCategorySpend = (subscriptions = []) => {
  const totals = {};
  for (const item of subscriptions) {
    if (!['Active', 'Trial'].includes(item.status)) continue;
    const cycleTotal = monthlyEquivalent(item.amount, item.billingCycle || 'Monthly');
    totals[item.category] = (totals[item.category] || 0) + cycleTotal;
  }
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
};

export const computeTotalMonthly = (subscriptions = []) => {
  return subscriptions
    .filter((item) => ['Active', 'Trial'].includes(item.status))
    .reduce((total, item) => total + monthlyEquivalent(item.amount, item.billingCycle || 'Monthly'), 0);
};

export const computeTotalYearly = (subscriptions = []) => {
  return subscriptions
    .filter((item) => ['Active', 'Trial'].includes(item.status))
    .reduce((total, item) => total + yearlyEquivalent(item.amount, item.billingCycle || 'Monthly'), 0);
};
