export const normalizeText = (value = '') => String(value).trim().toLowerCase();

export const matchesSearch = (source, query) => {
  const q = normalizeText(query);
  if (!q) return true;
  const haystack = [source?.name, source?.category, source?.description, source?.notes, source?.tags?.join(' ')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
};
