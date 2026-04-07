import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontFamily } from '../../constants/typography';
import { HomeIcon, BalancesIcon, ProfileIcon, AnalyticsIcon } from './TabIcons';
import { useTheme } from '../../hooks';

const TAB_CONFIG = [
  { name: 'Home',      label: 'Home',      Icon: HomeIcon },
  { name: 'Balances',  label: 'Balances',  Icon: BalancesIcon },
  { name: 'Analytics', label: 'Analytics', Icon: AnalyticsIcon },
  { name: 'Profile',   label: 'Profile',   Icon: ProfileIcon },
] as const;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const config = TAB_CONFIG[index];
          const color = isActive ? colors.textPrimary : colors.iconMuted;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <config.Icon color={color} size={20} filled={isActive} />
              <Text style={[styles.label, { color, fontFamily: isActive ? FontFamily.bold : FontFamily.regular }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  bar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    gap: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
