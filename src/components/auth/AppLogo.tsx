import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

export default function AppLogo() {
  const { isDark } = useTheme();
  return (
    <View style={[styles.logoBox, { backgroundColor: isDark ? '#FFFFFF' : '#1A1A2E' }]}>
      <Text style={[styles.logoLetter, { color: isDark ? '#1A1A2E' : '#FFFFFF' }]}>P</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 38,
  },
});
