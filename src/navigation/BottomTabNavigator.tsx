import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import BalancesScreen from '../screens/Balances/BalancesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import CustomTabBar from '../components/navigation/CustomTabBar';

export type BottomTabParamList = {
  Home: undefined;
  Balances: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: false,
      }}
      sceneContainerStyle={{ backgroundColor: '#000000' }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home"      component={HomeScreen} />
      <Tab.Screen name="Balances"  component={BalancesScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}
