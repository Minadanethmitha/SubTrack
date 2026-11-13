export const currencyMeta = {
  USD: { symbol: '$', name: 'US Dollar', perUSD: 1 },
  EUR: { symbol: '€', name: 'Euro', perUSD: 0.92 },
  GBP: { symbol: '£', name: 'Pound Sterling', perUSD: 0.78 },
  INR: { symbol: '₹', name: 'Indian Rupee', perUSD: 83 },
  LKR: { symbol: 'Rs', name: 'Sri Lankan Rupee', perUSD: 300 },
};

export const formatMoney = (amount = 0, currency = 'USD', locale = 'en-US') => {
  const safeAmount = Number(amount) || 0;
  const meta = currencyMeta[currency] || currencyMeta.USD;
  const digits = currency === 'LKR' ? 0 : 2;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(safeAmount);
  } catch (error) {
    return `${meta.symbol}${safeAmount.toFixed(digits)}`;
  }
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  const fromRate = rates?.[fromCurrency] || currencyMeta[fromCurrency]?.perUSD || 1;
  const toRate = rates?.[toCurrency] || currencyMeta[toCurrency]?.perUSD || 1;
  return (Number(amount) * fromRate) / toRate;
};
