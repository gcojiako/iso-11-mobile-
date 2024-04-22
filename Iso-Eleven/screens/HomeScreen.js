import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getAuth, signOut } from "firebase/auth";


const HomeScreen = ({ navigation, route }) => {
  const { uid, data } = route.params;
  const { username, score } = data;
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth).then(() => navigation.navigate("login"));
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.signOutButtonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <Text style={styles.title}>Welcome, {username}</Text>
      <Text style={styles.subtitle}>Your Score: {score}</Text>
      
      <Text style={styles.link} onPress={() => navigation.navigate('match-requests', {uid, username})}>Go to Match Requests</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('rankings', {uid, data})}>Go to Rankings</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('conversations', {uid, data})}>View Conversations</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  signOutButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default HomeScreen;

//include world rankings attribute
