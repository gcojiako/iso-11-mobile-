import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import RankingScreen from './screens/RankingScreen'
import ChatScreen from './screens/ChatScreen'
import MatchRequestsScreen from './screens/MatchRequestsScreen'

const Stack = createStackNavigator()
const StackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="ranking" component={RankingScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
    </Stack.Navigator>
  )
}

export default StackNavigator