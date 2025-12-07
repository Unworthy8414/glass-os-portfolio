// GlassOS color palette - matching the app case studies
export const colors = {
  // Primary palette
  charcoal: '#2a9d8f',      // Now maps to verdigris since bg is charcoal
  verdigris: '#2a9d8f',     // Verdigris - accent teal/green
  jasmine: '#e9c46a',       // Jasmine - highlight yellow
  sandy: '#f4a261',         // Sandy Brown - warm accent
  burnt: '#e76f51',         // Burnt Peach - alert/emphasis

  // Convenience mappings for semantic usage
  blue: '#2a9d8f',          // Map to verdigris (was charcoal)
  green: '#2a9d8f',         // Map to verdigris
  red: '#e76f51',           // Map to burnt
  orange: '#f4a261',        // Map to sandy
  yellow: '#e9c46a',        // Map to jasmine
  purple: '#2a9d8f',        // Map to verdigris (alternative)
  pink: '#e76f51',          // Map to burnt (alternative)
  teal: '#2a9d8f',          // Map to verdigris
  indigo: '#2a9d8f',        // Map to verdigris (was charcoal)
} as const;

export type ColorKey = keyof typeof colors;
