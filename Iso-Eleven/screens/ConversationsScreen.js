import { StyleSheet, Text, View, } from 'react-native'
import React, { useState, useEffect }from 'react'
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

const ConversationsScreen = ({navigation, route}) => {
  const { uid, data } = route.params;
  const { username } = data;

  const [allChats, setAllChats] = useState([])

  useEffect(() => {
    collectChats();
  }, [allChats]);

  const collectChats = async () => {
    // collect all messages. filter through them to get unique chats. need to click on each chat to see messages. to get to chat screen we need
    try {
      const dbRef = ref(getDatabase(), `messages/${uid}`)

      const sentMessagesSnapshot = await get(
        query(dbRef, orderByChild('from'), equalTo(username))
      );
      const receivedMessagesSnapshot = await get(
        query(dbRef, orderByChild('to'), equalTo(username))
      );

      const sentMessagesArray = [];
      sentMessagesSnapshot.forEach((messageSnapshot) => {
        const message = messageSnapshot.val();
        const {fromId, toId} = message;
        sentMessagesArray.push({ ...message, fromId, toId });
      });
  
      const receivedMessagesArray = [];
      receivedMessagesSnapshot.forEach((messageSnapshot) => {
        const message = messageSnapshot.val();
        // console.log("message: " + message.toId)
        const {fromId, toId} = message;
        receivedMessagesArray.push({ ...message, fromId, toId });
      });

      const allMessagesSnapshot = [...sentMessagesArray, ...receivedMessagesArray]
      // console.log(allMessagesSnapshot, 'received')
      const uniqueChats = Array.from(new Set(allMessagesSnapshot.map(message => {
        if(message.fromId === uid){
          return { id: message.toId, username: message.to };
        } else {
          return { id: message.fromId, username: message.from };
        }
        }
      ))) 
      // console.log(uniqueChats)
      setAllChats(uniqueChats)
      // console.log(allChats)

  }catch(error){
    console.error('messages error:', error);
    throw error;
  }}
  return (
    <View>
      {allChats.map((chat, index) => (
        <Text key={index}>
          {chat.id}
        </Text>
      ))}
    </View>
  )
}

export default ConversationsScreen

const styles = StyleSheet.create({})