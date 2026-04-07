import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: Props) {
  return (
    <Animated.View entering={FadeInUp.duration(300)} style={styles.fill}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
