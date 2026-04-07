import React from 'react';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { TransactionProvider, UserProvider, ThemeProvider, useThemeContext } from './src/store';

function ThemedRoot() {
  const { colors } = useThemeContext();
  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.background }]}>
      <UserProvider>
        <TransactionProvider>
          <AppNavigator />
        </TransactionProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

export default function App(): React.JSX.Element {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <ThemeProvider>
      <ThemedRoot />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#000000',
  },
});


