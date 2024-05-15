import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence, sendEmailVerification } from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set, get } from '@firebase/database';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID} from "@env"
import * as Location from 'expo-location';
import { useUID } from '../functions/UIDContext';
 
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth =  initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

const LoginScreen = ({navigation}) => {
  const { setUID } = useUID();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUID(uid);
        const userSnapshot = await get(ref(getDatabase(), `users/${uid}`));
        const userData = userSnapshot.val();

        if (userData && userData.onboardingComplete) {
          navigation.navigate('bottom-tabs', { screen: 'Home', params: { uid: uid } })
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      sendEmailVerification(userCredential.user)
      Alert.alert('Email verification sent, please verify')
      const {uid} = userCredential.user;
      setUID(uid);

      const userData = {
        email: email,
        password: password,
        score: 1200,
        signUpDate: new Date().toISOString(),
        onboardingComplete: false,
        location,
        username:'',
      }

      await set(ref(getDatabase(), `users/${uid}`), userData);

    } catch (error) {
      console.log('Sign Up Error', error.message);

      
      
  }};

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      if (!user.emailVerified) {
        Alert.alert("Email not verified. Please verify your email before signing in.");
        return;
      }
      const { uid} = user;
      setUID(uid);


      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location); 

      const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
      };
      
      
      await set(ref(getDatabase(), `users/${uid}/location`), userLocation);
      const userSnapshot = await get(ref(getDatabase(), `users/${uid}`))
      const userData = userSnapshot.val()
      const {username, onboardingComplete} = userData

      if(userData){
        // console.log(userData)
        {onboardingComplete ? (Alert.alert(`Welcome back ${username}!`),navigation.navigate('bottom-tabs', { screen: 'Home', params: { uid: uid } })): (navigation.navigate('onboarding', { uid: uid, data: userData }))}

      }

    } catch (error) {
      console.log('Sign In Error', error.message);
      
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={handleSignUp}
      />
      <Button
        title="Sign In"
        onPress={handleSignIn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;