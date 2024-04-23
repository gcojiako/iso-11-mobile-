import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import {
  query,
  orderByChild,
  getDatabase,
  ref,
  get,
  set,
  push,
  equalTo,
} from "@firebase/database";

const ChatScreen = ({ navigation, route }) => {
  const { uid, selectedPlayerUid, selectedPlayerUsername, username } = route.params;
  const [textArea, setTextArea] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    collectMessages();
  }, [messages]);

  const message = {
    timestamp: new Date().toISOString(),
    from: username,
    to: selectedPlayerUsername,
    fromId: uid,
    toId: selectedPlayerUid,
    message: textArea,
  };
  // console.log(message);
  const sendMessage = async () => {
    await push(ref(getDatabase(), `messages/${uid}`), message);
    await push(ref(getDatabase(), `messages/${selectedPlayerUid}`), message);
    setTextArea("")
  };

  const collectMessages = async () => {
    try {
      const dbRef = ref(getDatabase(), `messages/${uid}`);

      const sentMessagesSnapshot = await get(
        query(dbRef, orderByChild('from'), equalTo(selectedPlayerUsername))
      );
      const receivedMessagesSnapshot = await get(
        query(dbRef, orderByChild('to'), equalTo(selectedPlayerUsername))
      );
  
      const sentMessagesArray = [];
      sentMessagesSnapshot.forEach((messageSnapshot) => {
        const message = messageSnapshot.val();
        sentMessagesArray.push(message);
      });
  
      const receivedMessagesArray = [];
      receivedMessagesSnapshot.forEach((messageSnapshot) => {
        const message = messageSnapshot.val();
        receivedMessagesArray.push(message);
      });
  
      // Combine sent and received messages
      const allMessages = [...sentMessagesArray, ...receivedMessagesArray];
      // sort messages by timestamp
      allMessages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      setMessages(allMessages);
      

    } catch (error) {
      console.error('messages error:', error);
      throw error;
    }
  }; 
  ;
  return (
    <View style={styles.container}>
      <Text style={styles.selectedPlayerText}>{selectedPlayerUsername}</Text>
      {messages.map((message, index) => (
        <Text key={index} style={styles.message}>
          {message.from} - {message.message}
        </Text>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Write a message"
        onChangeText={setTextArea}
        value={textArea}
        autoCapitalize="none"
      />
      <Button title={"Send Message"} onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPlayerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  message: {
    marginBottom: 5,
  },
});

export default ChatScreen;