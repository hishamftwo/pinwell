import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { TabIcon } from '../components/TabIcon';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import WeightScreen from '../screens/WeightScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 12) : insets.bottom;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.teal,
          tabBarInactiveTintColor: colors.inkSoft,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: bottomPadding + 8,
            paddingTop: 8,
            height: 64 + bottomPadding,
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} /> }} />
        <Tab.Screen name="Progress" component={WeightScreen} options={{ tabBarIcon: ({ color }) => <TabIcon name="weight" color={color} /> }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
