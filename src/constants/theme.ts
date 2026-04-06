// src/constants/theme.ts

export const Colors = {
  // Brand accents — used sparingly (category icons, highlights, CTAs, gradients)
  teal:   '#3BB9A1',
  pink:   '#EE89DF',
  blue:   '#74B8EF',
  yellow: '#FBDE9D',

  // Gradient — used only on the main balance card
  gradientStart: '#FED4B4',
  gradientEnd:   '#3BB9A1',

  // Dark mode — primary UI (90% of the app)
  dark: {
    background:      '#000000',   // pure black base
    surface:         '#111111',   // cards, sheets
    surfaceElevated: '#1A1A1A',   // modals, bottom sheets
    border:          'rgba(255,255,255,0.08)',
    textPrimary:     '#FFFFFF',
    textSecondary:   '#999999',
    textMuted:       '#555555',
    icon:            '#FFFFFF',
    iconMuted:       '#666666',
    tabBar:          '#0A0A0A',
  },

  // Light mode — primary UI (90% of the app)
  light: {
    background:      '#FFFFFF',   // pure white base
    surface:         '#F5F5F5',   // cards, sheets
    surfaceElevated: '#EFEFEF',   // modals, bottom sheets
    border:          'rgba(0,0,0,0.08)',
    textPrimary:     '#000000',
    textSecondary:   '#555555',
    textMuted:       '#999999',
    icon:            '#000000',
    iconMuted:       '#AAAAAA',
    tabBar:          '#FFFFFF',
  },

  // Semantic — kept minimal, only for transaction +/- indicators
  income:  '#3BB9A1',   // teal for income amounts
  expense: '#EE89DF',   // pink for expense amounts
  error:   '#FF4444',
} as const;
