import { StyleSheet, Text, View, Button } from 'react-native'
import React, {useEffect} from 'react'
import { initializeApp } from '@firebase/app';
import {  onAuthStateChanged, initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID} from "@env"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useUID } from '../functions/UIDContext';
import { getDatabase, ref, set, get } from '@firebase/database';
import { auth } from '../firebase/firebase';
  

const LoginOrSignup = ({navigation}) => {
    //user chooses to signup or login and then sent to respective screens
    const { setUID } = useUID();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const uid = user.uid;
          setUID(uid);
          const userSnapshot = await get(ref(getDatabase(), `users/${uid}`));
          const userData = userSnapshot.val();
          if (userData && userData.onboardingComplete) {
            navigation.navigate('bottom-tabs', { screen: 'Home', params: { uid: uid } });
          }
        }
      });
  
      return () => unsubscribe();
    }, []);
    
  return (
    <View>
        <Text>Welcome to ISO 11</Text>
      <Button
        title="Login"
        onPress={ ()=>navigation.navigate('login')}
      />
      <Button
        title="Sign Up"
        onPress={()=>navigation.navigate('signup')}
      />
    </View>
  )
}

export default LoginOrSignup

const styles = StyleSheet.create({})