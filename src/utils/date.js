export const toDate = (value) => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const formatDate = (value, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  return toDate(value).toLocaleDateString('en-GB', options);
};

export const daysBetween = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

export const addDays = (dateValue, days) => {
  const date = toDate(dateValue);
  date.setDate(date.getDate() + days);
  return date;
};

export const isoToday = () => new Date().toISOString().slice(0, 10);

export const clampDayInMonth = (year, monthIndex, day) => {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return Math.min(day, lastDay);
};
