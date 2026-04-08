// src/constants/typography.ts
// Font: Inter (loaded via @expo-google-fonts/inter)

import { TextStyle } from 'react-native';

export const FontFamily = {
  regular:   'Inter_400Regular',
  medium:    'Inter_500Medium',
  semiBold:  'Inter_600SemiBold',
  bold:      'Inter_700Bold',
} as const;

// All text styles mapped directly from Figma specs
export const Typography = {

  // font-weight: 700 | font-size: 24 | line-height: 32 | letter-spacing: 0.07
  headingLarge: {
    fontFamily:    FontFamily.bold,
    fontSize:      24,
    lineHeight:    32,
    letterSpacing: 0.07,
  } as TextStyle,

  // font-weight: 500 | font-size: 20 | line-height: 28 | letter-spacing: -0.45
  headingMedium: {
    fontFamily:    FontFamily.medium,
    fontSize:      20,
    lineHeight:    28,
    letterSpacing: -0.45,
  } as TextStyle,

  // font-weight: 600 | font-size: 48 | line-height: 58 | letter-spacing: -2
  displayLarge: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      48,
    lineHeight:    58,
    letterSpacing: 0.5,
  } as TextStyle,

  // font-weight: 400 | font-size: 16 | line-height: 24 | letter-spacing: -0.31
  bodyLarge: {
    fontFamily:    FontFamily.regular,
    fontSize:      16,
    lineHeight:    24,
    letterSpacing: -0.31,
  } as TextStyle,

  // font-weight: 400 | font-size: 14 | line-height: 20 | letter-spacing: -0.15
  bodyMedium: {
    fontFamily:    FontFamily.regular,
    fontSize:      16,
    lineHeight:    20,
    letterSpacing: -0.15,
  } as TextStyle,

  // Utility styles built from the scale above
  label: {
    fontFamily:    FontFamily.medium,
    fontSize:      12,
    lineHeight:    16,
    letterSpacing: 0.3,
  } as TextStyle,

  labelUppercase: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      10,
    lineHeight:    14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  // Money display — tabular numbers for alignment
  moneyDisplay: {
    fontFamily:    FontFamily.bold,
    fontSize:      48,
    lineHeight:    58,
    letterSpacing: -2,
    fontVariant:   ['tabular-nums'],
  } as TextStyle,

  moneyLarge: {
    fontFamily:    FontFamily.bold,
    fontSize:      24,
    lineHeight:    32,
    letterSpacing: -0.5,
    fontVariant:   ['tabular-nums'],
  } as TextStyle,

  moneyMedium: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      20,
    lineHeight:    28,
    letterSpacing: -0.45,
    fontVariant:   ['tabular-nums'],
  } as TextStyle,

  moneySmall: {
    fontFamily:    FontFamily.medium,
    fontSize:      16,
    lineHeight:    24,
    letterSpacing: -0.31,
    fontVariant:   ['tabular-nums'],
  } as TextStyle,

} as const;

// Font weights as numbers for dynamic usage
export const FontWeight = {
  regular:  '400',
  medium:   '500',
  semiBold: '600',
  bold:     '700',
} as const;
