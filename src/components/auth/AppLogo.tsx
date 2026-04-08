import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

export default function AppLogo() {
  return (
    <View style={styles.logoBox}>
      <Text style={styles.logoLetter}>P</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.light.background,
    lineHeight: 38,
  },
});
