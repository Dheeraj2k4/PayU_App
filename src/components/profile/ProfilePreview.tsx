import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface ProfilePreviewProps {
  totalSpendings: string;
  email: string;
  balance: string;
}

interface StatRowProps {
  label: string;
  value: string;
  valueBold?: boolean;
}

function StatRow({ label, value, valueBold = false }: StatRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, valueBold && styles.valueBold, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

export default function ProfilePreview({ totalSpendings, email, balance }: ProfilePreviewProps) {
  return (
    <View style={styles.container}>
      <StatRow label="Total spendings:" value={totalSpendings} valueBold />
      <StatRow label="Email :" value={email} valueBold />
      <StatRow label="Balance :" value={balance} valueBold />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.dark.textSecondary,
  },
  value: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.dark.textPrimary,
  },
  valueBold: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.dark.textPrimary,
  },
});
