export const colors = {
  blue: '#3B82F6',
  green: '#22C55E',
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#EAB308',
  purple: '#A855F7',
  pink: '#EC4899',
  teal: '#14B8A6',
  indigo: '#6366F1',
} as const;

export type ColorKey = keyof typeof colors;
