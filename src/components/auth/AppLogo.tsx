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
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.dark.background,
    lineHeight: 38,
  },
});
