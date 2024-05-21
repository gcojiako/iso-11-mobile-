import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import React, {useState, Image} from "react";
import { getDatabase, ref, set, get } from '@firebase/database';

import { useUID } from "../functions/UIDContext";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';

const SignupScreen = ({navigation}) => {
  // user is sent here from login screen
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showSigninButton, setShowSigninButton] = useState(false);
  const { setUID } = useUID();

  const auth = getAuth();
  const handleSignUp = async () => {
    try {
      if (password!==  password2) {
        Alert.alert("Passwords do not match");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      sendEmailVerification(userCredential.user);
      Alert.alert("Email verification sent, please verify");
      const { uid } = userCredential.user;
      setUID(uid);

      const userData = {
        email: email,
        password: password,
        score: 1200,
        signUpDate: new Date().toISOString(),
        onboardingComplete: false,
        username: "",
        radius: 5
      };

      await set(ref(getDatabase(), `users/${uid}`), userData);
      setShowSigninButton(true)

    } catch (error) {
      console.log("Sign Up Error", error.message);
    }
  };
  //sign in button that takes user to login once the handsign in function is complete
  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize='none'
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        placeholder="please retype password"
        onChangeText={setPassword2}
        value={password2}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={handleSignUp}
      />
      {showSigninButton && (<Button
        title="go to login"
        onPress={()=>navigation.navigate('login')}
      />)}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({});
