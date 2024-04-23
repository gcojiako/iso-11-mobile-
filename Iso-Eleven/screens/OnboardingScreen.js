import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { query,orderByChild, equalTo, getDatabase, ref, get, set } from '@firebase/database';


const OnboardingScreen = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const {uid, data} = route.params


  const checkUsername = async (username) => {
    if (username.length < 5 || username.length > 30){
      Alert.alert('Username must be within 5 and 30 characters');
        return false;
    }
    const dbRef = ref(getDatabase(), 'users');
    try {
      const usernameValid = await get(query(dbRef, orderByChild('username'), equalTo(username)));
  
      if (!usernameValid.exists()) {
        return true;
      } else {
        Alert.alert('Username taken');
        return false;
      }
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  }; 

  const handleContinue = async (username) => {
    
    try{
      if (await checkUsername(username)) {
        await Promise.all([
       set(ref(getDatabase(), `users/${uid}/username`), username),
       set(ref(getDatabase(), `users/${uid}/onboardingComplete`), true)
      ]);
    Alert.alert('Cool name! Welcome to ISO 11');

    navigation.navigate('home', {uid: uid, data: data})
    }}catch(error){
      console.log(error);
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please create a username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <Button
        title="Continue"
        onPress={() => handleContinue(username)}
        disabled={!username.trim()} 
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

export default OnboardingScreen;
