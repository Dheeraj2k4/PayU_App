import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { FontFamily } from '../../constants/typography';

function CardLogo() {
  return (
    <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
      <Circle cx={19} cy={19} r={19} fill="rgba(255,255,255,0.2)" />
      <Circle cx={15} cy={19} r={7} fill="rgba(255,255,255,0.9)" />
      <Circle cx={23} cy={19} r={7} fill="rgba(255,255,255,0.5)" />
    </Svg>
  );
}

export interface BankCardProps {
  bankName?: string;
  cardNumber?: string;
  holderName?: string;
  expiredDate?: string;
  /** 'peach-teal' = #FED4B4 → #3BB9A1  |  'dark' = #192D29 → #262626 → #0A0A0A */
  variant?: 'peach-teal' | 'dark';
}

export default function BankCard({
  bankName = 'ADRBank',
  cardNumber = '8763 1111 2222 0329',
  holderName = 'ALEX',
  expiredDate = '10/28',
  variant = 'peach-teal',
}: BankCardProps) {
  const gradientColors =
    variant === 'peach-teal'
      ? (['#FED4B4', '#3BB9A1'] as const)
      : (['#192D29', '#262626', '#0A0A0A'] as const);

  const textColor = '#FFFFFF';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <Text style={[styles.bankName, { color: textColor }]}>{bankName}</Text>
        <CardLogo />
      </View>

      {/* Card number */}
      <Text style={[styles.cardNumber, { color: textColor }]}>{cardNumber}</Text>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.bottomField}>
          <Text style={[styles.fieldLabel, { color: 'rgba(255,255,255,0.7)' }]}>
            Card Holder Name
          </Text>
          <Text style={[styles.fieldValue, { color: textColor }]}>{holderName}</Text>
        </View>
        <View style={[styles.bottomField, styles.bottomFieldRight]}>
          <Text style={[styles.fieldLabel, { color: 'rgba(255,255,255,0.7)' }]}>
            Expired Date
          </Text>
          <Text style={[styles.fieldValue, { color: textColor }]}>{expiredDate}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 22,
    gap: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  cardNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    letterSpacing: 2,
    lineHeight: 30,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomField: {
    gap: 3,
  },
  bottomFieldRight: {
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  fieldValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
});
