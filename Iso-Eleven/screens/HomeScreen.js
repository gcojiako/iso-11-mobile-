import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import getUser from '../functions/getUser';


const HomeScreen = ({ navigation, route }) => {
  const { uid} = route.params;
  const auth = getAuth();
  const [userData, setUserData] = useState(null)


  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const data = await getUser({ uid });
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [uid])

  const handleSignOut = () => {
    signOut(auth).then(() => navigation.navigate("login"));
  }


  

  return (
    <View style={styles.container}>
      <View style={styles.signOutButtonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      {userData && (
        <React.Fragment>
          <Text style={styles.title}>Welcome, {userData.username}</Text>
          <Text style={styles.subtitle}>Your Score: {userData.score}</Text>
        </React.Fragment>
      )}
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
    top: 100,
    right: 20,
  },
});

export default HomeScreen;

//include world rankings attribute
