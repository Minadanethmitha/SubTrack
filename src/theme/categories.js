import { Ionicons } from '@expo/vector-icons';

export const categoryMeta = {
  Streaming: { icon: 'play-circle', color: '#8B5CF6' },
  'Music': { icon: 'musical-notes', color: '#EC4899' },
  'Gaming': { icon: 'game-controller', color: '#10B981' },
  'Cloud & Storage': { icon: 'cloud', color: '#3B82F6' },
  'Software & Productivity': { icon: 'desktop', color: '#6366F1' },
  'Education': { icon: 'school', color: '#F59E0B' },
  'News & Reading': { icon: 'newspaper', color: '#84CC16' },
  'Fitness & Health': { icon: 'fitness', color: '#14B8A6' },
  'Utilities & Bills': { icon: 'flash', color: '#F97316' },
  'Finance & Insurance': { icon: 'shield-checkmark', color: '#E11D48' },
  'Shopping & Delivery': { icon: 'bag', color: '#22C55E' },
  Other: { icon: 'ellipsis-horizontal', color: '#64748B' },
};

export const getCategoryIcon = (category) => categoryMeta[category]?.icon || 'pricetag';
export const getCategoryColor = (category) => categoryMeta[category]?.color || '#64748B';

export const CategoryIcon = ({ category, size = 20, color }) => (
  <Ionicons name={getCategoryIcon(category)} size={size} color={color || getCategoryColor(category)} />
);
