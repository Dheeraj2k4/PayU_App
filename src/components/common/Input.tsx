import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

function EyeIcon({ visible }: { visible: boolean }) {
  const color = Colors.dark.iconMuted;
  if (visible) {
    // eye-open
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
      </Svg>
    );
  }
  // eye-off
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.12 14.12a3 3 0 11-4.24-4.24"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 1l22 22"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function Input({
  label,
  isPassword = false,
  containerStyle,
  ...rest
}: InputProps) {
  const [secure, setSecure] = useState(isPassword);
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text> : null}
      <View style={[styles.inputWrapper, {
        backgroundColor: isDark ? '#262626' : colors.surfaceElevated,
        borderColor: colors.border,
      }]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholderTextColor={isDark ? '#A1A1A1' : colors.textMuted}
          secureTextEntry={secure}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setSecure((prev) => !prev)}
            style={styles.eyeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <EyeIcon visible={!secure} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 36,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.31,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  eyeButton: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
