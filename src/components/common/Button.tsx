import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Primary: dark-on-light in light mode, light-on-dark in dark mode
  const primaryBg = isDark ? Colors.light.background : Colors.dark.background;
  const primaryText = isDark ? Colors.dark.background : Colors.light.background;

  const labelColor =
    variant === 'primary'
      ? primaryText
      : variant === 'secondary'
      ? colors.textPrimary
      : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          animatedStyle,
          styles.base,
          variant === 'primary' && [styles.primary, { backgroundColor: primaryBg }],
          variant === 'secondary' && [styles.secondary, { backgroundColor: colors.surface, borderColor: colors.border }],
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={labelColor} />
        ) : (
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.light.background,
  },
  secondary: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
});
