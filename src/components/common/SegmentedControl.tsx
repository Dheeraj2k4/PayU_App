import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Background color of the track. Defaults to colors.surface */
  trackColor?: string;
  /** Background color of the active pill. Defaults to Colors.light.background */
  pillColor?: string;
  /** Active label color. Defaults to Colors.dark.background */
  activeTextColor?: string;
  /** Inactive label color. Defaults to colors.textSecondary */
  inactiveTextColor?: string;
}

export default function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  trackColor,
  pillColor = Colors.light.background,
  activeTextColor = Colors.dark.background,
  inactiveTextColor,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = options.findIndex((o) => o.value === value);
  const segW = trackWidth > 0 ? (trackWidth - 8) / options.length : 0;

  const pillX = useSharedValue(0);

  const pillStyle = useAnimatedStyle(() => ({
    width: segW,
    transform: [{ translateX: pillX.value }],
  }));

  function handlePress(option: SegmentedControlOption<T>, index: number) {
    pillX.value = withSpring(index * segW, { damping: 20, stiffness: 200, mass: 0.6 });
    onChange(option.value);
  }

  function onLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    setTrackWidth(w);
    // Jump pill to correct position on first measure
    const idx = options.findIndex((o) => o.value === value);
    const seg = (w - 8) / options.length;
    pillX.value = idx * seg;
  }

  const bg = trackColor ?? colors.surface;
  const inactiveColor = inactiveTextColor ?? colors.textSecondary;

  return (
    <View
      style={[styles.track, { backgroundColor: bg }]}
      onLayout={onLayout}
    >
      {/* Animated pill */}
      <Animated.View style={[styles.pill, pillStyle, { backgroundColor: pillColor }]} />

      {/* Labels */}
      {options.map((opt, i) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.segment}
          onPress={() => handlePress(opt, i)}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.label,
              { color: inactiveColor },
              value === opt.value && [styles.labelActive, { color: activeTextColor }],
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    height: 44,
  },
  pill: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  labelActive: {
    fontFamily: FontFamily.semiBold,
  },
});
