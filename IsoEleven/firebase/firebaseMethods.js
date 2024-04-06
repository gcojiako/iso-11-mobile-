import { getFirebaseApp } from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
// import AsyncStorage from '@react-native-async-storage/async-storage';

const signUp = (username, email, password) => {
    return async () => {
        try {
            const app = getFirebaseApp();
            const auth = getAuth(app);

            // Create user with email and password
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // Extract user's UID (user ID)
            const { uid } = result.user;

            // Create user data for the database
            const userData = {
                username,
                email,
                signUpDate: new Date().toISOString()
            };

            // Save user data to the database
            await set(ref(getDatabase(), `users/${uid}`), userData);

            // Dispatch action if needed
            // dispatch();

            // Return result or do other post-sign-up actions
            return result;
        } catch (error) {
            console.log(error.message);
            throw error; // Rethrow the error for potential handling in the caller
        }
    };
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
