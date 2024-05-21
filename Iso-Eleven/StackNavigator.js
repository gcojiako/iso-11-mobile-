import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import OnboardingScreen from './onboarding/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import RankingScreen from './screens/RankingScreen'
import ChatScreen from './screens/ChatScreen'
import MatchRequestsScreen from './screens/MatchRequestsScreen'
import RequestSendScreen from './screens/RequestSendScreen'
import ConversationsScreen from './screens/ConversationsScreen'
import RequestViewScreen from './screens/RequestViewScreen'
import { useUID } from './functions/UIDContext'
import BottomTabNavigator from './BottomTabNavigator'
import ForgotPassword from './screens/ForgotPassword'
import OnboardingScreen2 from './onboarding/OnboardingScreen2'
import LoginOrSignup from './screens/LoginOrSignup'
import SignupScreen from './screens/SignupScreen'

const Stack = createNativeStackNavigator()
const StackNavigator = () => {
  const { uid } = useUID();
  return (
    <Stack.Navigator >
      <Stack.Screen name="login-signup" component={LoginOrSignup} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="onboarding" component={OnboardingScreen} />
        <Stack.Screen name="onboarding-2" component={OnboardingScreen2} />
        <Stack.Screen name="bottom-tabs" component={BottomTabNavigator} initialParams={{ uid: uid }} />
        {/* <Stack.Screen name="home" component={HomeScreen} /> */}
        {/* <Stack.Screen name="rankings" component={RankingScreen} /> */}
        {/* <Stack.Screen name="conversations" component={ConversationsScreen} /> */}
        <Stack.Screen name="chat" component={ChatScreen} />
        {/* <Stack.Screen name="match-requests" component={MatchRequestsScreen} /> */}
        <Stack.Screen name="requests-send" component={RequestSendScreen} />
        <Stack.Screen name="requests-view" component={RequestViewScreen} />
        <Stack.Screen name="forgot-password" component={ForgotPassword} />
    </Stack.Navigator>
  )
}

export default StackNavigator