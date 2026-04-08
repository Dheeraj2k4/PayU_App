import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface ProfileAvatarProps {
  name: string;
  initial?: string;
}

export default function ProfileAvatar({ name, initial }: ProfileAvatarProps) {
  const letter = initial ?? name.charAt(0).toUpperCase();
  const { colors, isDark } = useTheme();
  const avatarBg = isDark ? Colors.light.background : Colors.dark.background;
  const avatarText = isDark ? Colors.dark.background : Colors.light.background;

  return (
    <View style={styles.container}>
      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        <Text style={[styles.avatarLetter, { color: avatarText }]}>{letter}</Text>
      </View>
      <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
    color: Colors.dark.textPrimary,
  },
});
