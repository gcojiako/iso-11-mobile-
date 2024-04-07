import { getFirebaseApp } from "./firebaseConfig";
import { FIREBASE_AUTH, FIREBASE_APP } from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const signUp = async (email, password) => {
  try {
    const auth = getAuth();
    console.log("auth: ", auth);

    // Create user with email and password
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("result: ", result);

    // Extract user's UID (user ID)
    const { uid } = result.user;
    console.log("uid: ", uid);

    // Create user data for the database
    const userData = {
      // username,
      email: email,
      score: 500,
      // location,
      signUpDate: new Date().toISOString(),
    };

    // Save user data to the database
    await set(ref(getDatabase(), `users/${uid}`), userData);

    // Return result or do other post-sign-up actions
    return result;
  } catch (error) {
    console.log(error.message);
    // Handle specific errors
    if (error.code === "auth/invalid-email") {
      Alert.alert("Invalid email");
    } else if (error.code === "auth/weak-password") {
      Alert.alert("Password should be at least 6 characters long");
    } else if (error.code === "auth/email-already-in-use") {
      Alert.alert("Email already in use, please sign in");
      throw error; // Rethrow the error for potential handling in the caller
    }
  }
};

const signIn = (email, password) => {
  return async () => {
    try {
      // Get Firebase app instance
      const app = getFirebaseApp();
      // Get authentication instance
      const auth = getAuth(app);

      // Sign in user with email and password
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Return result or perform post-sign-in actions
      return result;
    } catch (error) {
      console.log(error.message);
      throw error; // Rethrow the error for potential handling in the caller
    }
  };
};

export { signUp, signIn };
