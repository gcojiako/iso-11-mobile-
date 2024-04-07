import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import RankingScreen from './screens/RankingScreen'
import ChatScreen from './screens/ChatScreen'
import MatchRequestsScreen from './screens/MatchRequestsScreen'

const Stack = createNativeStackNavigator()
const StackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="onboarding" component={OnboardingScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="ranking" component={RankingScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="requests" component={MatchRequestsScreen} />
    </Stack.Navigator>
  )
}

export default StackNavigator