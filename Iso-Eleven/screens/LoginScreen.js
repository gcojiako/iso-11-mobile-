import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,

} from "@firebase/auth";
import { getDatabase, ref, set, get } from "@firebase/database";
import * as Location from "expo-location";
import { useUID } from "../functions/UIDContext";

const LoginScreen = ({ navigation }) => {
  const { setUID } = useUID();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      // if (!user.emailVerified) {
      //   Alert.alert("Email not verified. Please verify your email before signing in.");
      //   return;
      // }
      const { uid } = user;
      setUID(uid);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      await set(ref(getDatabase(), `users/${uid}/location`), userLocation);
      const userSnapshot = await get(ref(getDatabase(), `users/${uid}`));
      const userData = userSnapshot.val();
      const { username, onboardingComplete } = userData;

      if (userData) {
        // console.log(userData)
        {
          onboardingComplete
            ? (Alert.alert(`Welcome back ${username}!`),
              navigation.navigate("bottom-tabs", {
                screen: "Home",
                params: { uid: uid },
              }))
            : navigation.navigate("onboarding", { uid: uid, data: userData });
        }
      }
    } catch (error) {
      console.log("Sign In Error", error.message);
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
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Forgot Password"
        onPress={() => navigation.navigate("forgot-password")}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
