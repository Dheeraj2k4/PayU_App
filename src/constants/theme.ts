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
    background:      '#F7F9FC',   // soft off-white base
    surface:         '#FFFFFF',   // cards, sheets
    surfaceElevated: '#EEF2F7',   // modals, bottom sheets
    border:          '#E2E8F0',
    textPrimary:     '#0F172A',
    textSecondary:   '#64748B',
    textMuted:       '#94A3B8',
    icon:            '#0F172A',
    iconMuted:       '#94A3B8',
    tabBar:          '#FFFFFF',
  },

  // Semantic — kept minimal, only for transaction +/- indicators
  income:  '#FFFFFF',   // white for income amounts
  expense: '#FFFFFF',   // white for expense amounts
  error:   '#FF4444',
} as const;
