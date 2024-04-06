import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { signUp, signIn } from '../firebase/firebaseMethods';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      Alert.alert('Sign Up Successful');
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      Alert.alert('Sign In Successful');
    } catch (error) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
