import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/Auth/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SearchScreen from '../screens/Search/SearchScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import { useThemeContext } from '../store';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Search: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isDark, colors } = useThemeContext();

  const navTheme = isDark
    ? { ...DarkTheme,    colors: { ...DarkTheme.colors,    background: colors.background, card: colors.tabBar } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, card: colors.tabBar } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
        initialRouteName="Auth"
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
