import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.9977 13.9977L11.1049 11.1048"
        stroke={color}
        strokeWidth={1.33311}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.33209 12.6646C10.2771 12.6646 12.6645 10.2772 12.6645 7.33212C12.6645 4.38709 10.2771 1.99966 7.33209 1.99966C4.38706 1.99966 1.99963 4.38709 1.99963 7.33212C1.99963 10.2772 4.38706 12.6646 7.33209 12.6646Z"
        stroke={color}
        strokeWidth={1.33311}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.84424 13.9977C6.96125 14.2003 7.12954 14.3686 7.33219 14.4856C7.53484 14.6026 7.76472 14.6642 7.99872 14.6642C8.23271 14.6642 8.46259 14.6026 8.66524 14.4856C8.86789 14.3686 9.03618 14.2003 9.15319 13.9977"
        stroke={color}
        strokeWidth={1.33311}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.17427 10.2156C2.0872 10.3111 2.02973 10.4298 2.00887 10.5573C1.98801 10.6848 2.00465 10.8156 2.05676 10.9338C2.10888 11.052 2.19423 11.1525 2.30242 11.2231C2.41062 11.2937 2.537 11.3314 2.66619 11.3315H13.3311C13.4603 11.3315 13.5867 11.294 13.695 11.2235C13.8032 11.1531 13.8887 11.0527 13.9409 10.9345C13.9932 10.8164 14.01 10.6856 13.9893 10.5581C13.9686 10.4306 13.9113 10.3118 13.8244 10.2163C12.9378 9.30245 11.998 8.33128 11.998 5.33244C11.998 4.27175 11.5766 3.2545 10.8266 2.50448C10.0766 1.75446 9.05934 1.3331 7.99865 1.3331C6.93796 1.3331 5.92071 1.75446 5.17069 2.50448C4.42066 3.2545 3.99931 4.27175 3.99931 5.33244C3.99931 8.33128 3.05879 9.30245 2.17427 10.2156Z"
        stroke={color}
        strokeWidth={1.33311}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface HomeHeaderProps {
  notificationCount?: number;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

export default function HomeHeader({
  notificationCount = 0,
  onSearchPress,
  onNotificationPress,
}: HomeHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Logo + App name */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>P</Text>
        </View>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>PayU</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn} activeOpacity={0.7}>
          <SearchIcon color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn} activeOpacity={0.7}>
          <BellIcon color={colors.icon} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.dark.background,
    lineHeight: 22,
  },
  appName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    color: Colors.dark.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 14,
  },
});
