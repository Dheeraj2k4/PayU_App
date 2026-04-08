import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { FontFamily } from '../../constants/typography';

function CardLogo() {
  return (
    <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3334 7.01118C14.3467 6.3519 13.1867 6 12 6V0C14.3734 0 16.6934 0.703788 18.6668 2.02237C20.6402 3.34094 22.1783 5.21509 23.0866 7.40778C23.9948 9.60048 24.2324 12.0133 23.7694 14.3411C23.3064 16.6688 22.1635 18.8071 20.4853 20.4853C18.8071 22.1635 16.6688 23.3064 14.3411 23.7694C12.0133 24.2324 9.60048 23.9948 7.40778 23.0866C5.21509 22.1783 3.34094 20.6402 2.02237 18.6668C0.703788 16.6934 0 14.3734 0 12H6C6 13.1867 6.3519 14.3467 7.01118 15.3334C7.67046 16.3201 8.60754 17.0891 9.70392 17.5433C10.8002 17.9974 12.0067 18.1162 13.1705 17.8847C14.3344 17.6532 15.4035 17.0818 16.2427 16.2427C17.0818 15.4035 17.6532 14.3344 17.8847 13.1705C18.1162 12.0067 17.9974 10.8002 17.5433 9.70392C17.0891 8.60754 16.3201 7.67046 15.3334 7.01118Z"
        fill="white"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2.59875e-06C6 0.787934 5.84481 1.56815 5.54328 2.2961C5.24175 3.02406 4.79979 3.68549 4.24264 4.24264C3.68549 4.7998 3.02406 5.24175 2.2961 5.54328C1.56814 5.84481 0.787929 6 2.62266e-07 6L0 12C1.57586 12 3.13629 11.6896 4.5922 11.0866C6.04812 10.4835 7.371 9.59958 8.48526 8.48526C9.59958 7.371 10.4835 6.04812 11.0866 4.5922C11.6896 3.13629 12 1.57586 12 0L6 2.59875e-06Z"
        fill="white"
      />
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
    borderRadius: 16,
    height: 218,
    marginHorizontal: 16,
    padding: 22,
    justifyContent: 'space-between',
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
