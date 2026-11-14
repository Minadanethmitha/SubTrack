import { clampDayInMonth } from './date';

export const billingCycles = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

export const monthlyEquivalent = (amount, cycle) => {
  const value = Number(amount) || 0;
  if (cycle === 'Weekly') return value * (52 / 12);
  if (cycle === 'Quarterly') return value / 3;
  if (cycle === 'Yearly') return value / 12;
  return value;
};

export const yearlyEquivalent = (amount, cycle) => {
  const value = Number(amount) || 0;
  if (cycle === 'Weekly') return value * 52;
  if (cycle === 'Monthly') return value * 12;
  if (cycle === 'Quarterly') return value * 4;
  return value;
};

export const nextBillingDate = (startDate, cycle, today = new Date()) => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return new Date();

  const anchor = new Date(today);
  anchor.setHours(0, 0, 0, 0);

  if (cycle === 'Weekly') {
    const diff = Math.ceil((anchor - start) / (1000 * 60 * 60 * 24 * 7));
    const base = new Date(start);
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + diff * 7);
    return base;
  }

  if (cycle === 'Monthly') {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const day = clampDayInMonth(year, month, start.getDate());
    const candidate = new Date(year, month, day);
    candidate.setHours(0, 0, 0, 0);
    if (candidate < anchor) {
      const next = new Date(year, month + 1, day);
      next.setHours(0, 0, 0, 0);
      return next;
    }
    return candidate;
  }

  if (cycle === 'Quarterly') {
    const targetMonth = Math.floor(anchor.getMonth() / 3) * 3;
    const candidate = new Date(anchor.getFullYear(), targetMonth, clampDayInMonth(anchor.getFullYear(), targetMonth, start.getDate()));
    candidate.setHours(0, 0, 0, 0);
    if (candidate < anchor) {
      const next = new Date(anchor.getFullYear(), targetMonth + 3, clampDayInMonth(anchor.getFullYear(), targetMonth + 3, start.getDate()));
      next.setHours(0, 0, 0, 0);
      return next;
    }
    return candidate;
  }

  const candidate = new Date(start);
  candidate.setHours(0, 0, 0, 0);
  while (candidate < anchor) {
    candidate.setFullYear(candidate.getFullYear() + 1);
  }
  return candidate;
};

export const daysUntil = (dateValue, today = new Date()) => {
  const target = new Date(dateValue);
  const current = new Date(today);
  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  return Math.ceil((target - current) / (1000 * 60 * 60 * 24));
};
