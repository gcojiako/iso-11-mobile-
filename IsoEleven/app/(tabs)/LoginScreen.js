import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, set } from '@firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAOZ_th0j76fWuIK0xPQomw_bUEbc4oTU8",
  authDomain: "iso-11.firebaseapp.com",
  databaseURL: "https://iso-11-default-rtdb.firebaseio.com",
  projectId: "iso-11",
  storageBucket: "iso-11.appspot.com",
  messagingSenderId: "1058607854478",
  appId: "1:1058607854478:web:96a856c473334b4d91aadf",
  measurementId: "G-7GJZPCVYLQ"
};

initializeApp(firebaseConfig);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      const database = getDatabase();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const {uid} = userCredential.user;

      const userData = {
        email: email,
        password: password,
        score: 500,
        signUpDate: new Date().toISOString(),
      }

      await set(ref(getDatabase(), `users/${uid}`), userData);
      Alert.alert('Sign Up Successful');
    } catch (error) {
      console.log('Sign Up Error', error.message);

      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid email");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Password should be at least 6 characters long");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email already in use, please sign in");
    }else{
        Alert.alert('Sign Up Unsuccessful');
    }
      throw error;
  }};

  const handleSignIn = async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Sign In Successful');
    } catch (error) {
      console.log('Sign In Error', error.message);
      
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid email");
      } else if (error.code === "auth/user-disabled") {
        Alert.alert("Your account has been disabled");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("No user found with this email");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Invalid password");
      } else {
        Alert.alert('Sign In Unsuccessful, make sure you have entered the correct email and password');
      }
      throw error;
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