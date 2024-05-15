import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MatchRequestsScreen from './screens/MatchRequestsScreen';
import ConversationsScreen from './screens/ConversationsScreen';
import RankingScreen from './screens/RankingScreen';
import HomeScreen from './screens/HomeScreen';



const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({route}) {
    const { uid } = route.params;
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Rankings') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Conversations') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Requests') {
              iconName = focused ? 'basketball' : 'basketball-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name="Requests" component={MatchRequestsScreen} initialParams={{ uid: uid}}/>
        <Tab.Screen name="Rankings" component={RankingScreen} initialParams={{ uid: uid}}/>
        <Tab.Screen name="Conversations" component={ConversationsScreen} initialParams={{ uid: uid}}/>
        <Tab.Screen name="Home" component={HomeScreen} initialParams={{ uid: uid}}/>
      </Tab.Navigator>
    );
  }