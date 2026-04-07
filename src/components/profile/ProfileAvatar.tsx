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
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <Text style={styles.avatarLetter}>{letter}</Text>
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
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.dark.background,
    lineHeight: 24,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
    color: Colors.dark.textPrimary,
  },
});
