import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { HomeIcon, BalancesIcon, ProfileIcon } from './TabIcons';

const TAB_CONFIG = [
  { name: 'Home',     label: 'Home',     Icon: HomeIcon },
  { name: 'Balances', label: 'Balances', Icon: BalancesIcon },
  { name: 'Profile',  label: 'Profile',  Icon: ProfileIcon },
] as const;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const config = TAB_CONFIG[index];
          const color = isActive ? Colors.dark.textPrimary : Colors.dark.iconMuted;

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
              <config.Icon
                color={isActive ? Colors.dark.textPrimary : Colors.dark.iconMuted}
                size={24}
                {...(config.name === 'Balances' ? { filled: isActive } : {})}
              />
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
    backgroundColor: Colors.dark.tabBar,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
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
