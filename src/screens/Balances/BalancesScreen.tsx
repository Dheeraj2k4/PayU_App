import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Polygon } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import HomeHeader from '../../components/home/HomeHeader';
import { CreditScoreGauge, SpendingBarChart } from '../../components/charts';

// ── Icons ────────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke={Colors.dark.textMuted}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusSmallIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={Colors.dark.textPrimary}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PlusLargeIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={Colors.dark.textPrimary}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ── Currency Card ─────────────────────────────────────────────────────────────

function CurrencyCard() {
  return (
    <View style={styles.currencyCard}>
      <View style={styles.currencyLeft}>
        {/* Canadian flag emoji as a simple text flag */}
        <View style={styles.flagBox}>
          <Text style={styles.flagEmoji}>🇨🇦</Text>
        </View>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>CAD</Text>
          <Text style={styles.currencyName}>Canadian Dollar</Text>
        </View>
      </View>

      <View style={styles.currencyRight}>
        <TouchableOpacity activeOpacity={0.7} style={styles.starBtn}>
          <StarIcon />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.enableBtn}>
          <PlusSmallIcon />
          <Text style={styles.enableText}>Enable</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function BalancesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <HomeHeader notificationCount={2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Your Balances</Text>
          <Text style={styles.subtitle}>Manage your multi-currency accounts</Text>
        </View>

        {/* Credit Score Gauge */}
        <CreditScoreGauge score={660} lastCheckDate="21 Apr" />

        {/* Available Currencies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Currencies</Text>
          <CurrencyCard />
        </View>

        {/* Spending Bar Chart */}
        <SpendingBarChart
          currentSpend={350}
          totalBudget={640}
          periodLabel="April Spendings"
        />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity activeOpacity={0.85} style={styles.fab}>
        <PlusLargeIcon />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 28,
  },

  // Title
  titleBlock: {
    gap: 4,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
  },

  // Section
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },

  // Currency card
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flagBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 22,
  },
  currencyInfo: {
    gap: 2,
  },
  currencyCode: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
  },
  currencyName: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  starBtn: {
    padding: 4,
  },
  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  enableText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.dark.textPrimary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

