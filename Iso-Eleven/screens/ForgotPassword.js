import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'
import React, {useState} from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ForgotPassword = ({navigation}) => {
    const auth = getAuth()
    const [email, setEmail] = useState('')
    // email input
    // submit button
    // back to login button

    const sendEmail = () =>{
        try{
            sendPasswordResetEmail(auth, email)
            setEmail('')
        }
        catch(error){
            console.log(error.message)
        }
        Alert.alert('Email sent, please check your inbox')
        
    }
  return (
    <View>
      <Text>Please type the email associated with this account</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize='none'
      />
      <Button
        title="Send Password Reset Email"
        onPress={sendEmail}
      />
      <Button
        title="Go back to Login"
        onPress={navigation.goBack}
      />
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({})