import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// import { initializeAuth, getReactNativePersistence } from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-firebase/storage';

// let firebaseApp;

//  const getFirebaseApp = () => {
//     if (firebaseApp) {
//         return { firebaseApp };
//     }

//     const firebaseConfig = {
//       apiKey: "AIzaSyAOZ_th0j76fWuIK0xPQomw_bUEbc4oTU8",
//       authDomain: "iso-11.firebaseapp.com",
//       databaseURL: "https://iso-11-default-rtdb.firebaseio.com",
//       projectId: "iso-11",
//       storageBucket: "iso-11.appspot.com",
//       messagingSenderId: "1058607854478",
//       appId: "1:1058607854478:web:96a856c473334b4d91aadf",
//       measurementId: "G-7GJZPCVYLQ"
//     };

//       firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
//       // firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//       // initializeAuth(firebaseApp, {
//       //     persistence: getReactNativePersistence(AsyncStorage)
//       // });
  
//       return { firebaseApp};
// }

  console.log("hdshsdjhdsjhhsd")
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
  const FIREBASE_APP = initializeApp(firebaseConfig);
  console.log('FIREBASE_APP: ', FIREBASE_APP);
  const FIREBASE_AUTH = getAuth(FIREBASE_APP);
  console.log('FIREBASE_AUTH: ', FIREBASE_AUTH);

  export { FIREBASE_APP, FIREBASE_AUTH, firebaseConfig };

