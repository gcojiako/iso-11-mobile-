import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import RankingScreen from './screens/RankingScreen'
import ChatScreen from './screens/ChatScreen'
import MatchRequestsScreen from './screens/MatchRequestsScreen'
import RequestScreen from './screens/RequestScreen'
import ConversationsScreen from './screens/ConversationsScreen'

const Stack = createNativeStackNavigator()
const StackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="onboarding" component={OnboardingScreen} />
        <Stack.Screen name="home" component={HomeScreen} options={{headerLeft: null}} />
        <Stack.Screen name="rankings" component={RankingScreen} />
        <Stack.Screen name="conversations" component={ConversationsScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="match-requests" component={MatchRequestsScreen} />
        <Stack.Screen name="requests" component={RequestScreen} />
    </Stack.Navigator>
  )
}

export default StackNavigator