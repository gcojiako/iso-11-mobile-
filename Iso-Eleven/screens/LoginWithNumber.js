import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

// const app = getApp();
// const auth = getAuth(app);

const LoginWithNumber = ({ navigation }) => {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function loginInWithPhoneNumber(phoneNumber) {
    console.log('starting sign in with phone number')
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    console.log('ran sign in with phone number: ' + phoneNumber)
    console.log("confirmation: ",confirm)
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
      <Button
        title="Phone Number Sign In"
        onPress={() => loginInWithPhoneNumber('+1 773-641-0613')}
      />
    );
  }
  
  return (
    <>
    {/* <View> */}
    <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    {/* </View> */}
      
    </>
  );
}

export default LoginWithNumber;


