import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const { uid, data } = route.params;
  const { username, score } = data;
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}</Text>
      <Text style={styles.subtitle}>Your Score: {score}</Text>
      
      <Text style={styles.link} onPress={() => navigation.navigate('requests', {uid, data})}>Go to Match Requests</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('rankings', {uid, data})}>Go to Rankings</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('chat', {uid, data})}>Go to Chat</Text>
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
});

export default HomeScreen;

//include world rankings attribute
