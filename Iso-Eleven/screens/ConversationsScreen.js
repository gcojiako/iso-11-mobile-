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
        sentMessagesArray.push(message);
      });
  
      const receivedMessagesArray = [];
      receivedMessagesSnapshot.forEach((messageSnapshot) => {
        const message = messageSnapshot.val();
        receivedMessagesArray.push(message);
      });

      const allMessagesSnapshot = [...sentMessagesArray, ...receivedMessagesArray]

      const uniqueUsers = {}
      allMessagesSnapshot.forEach((message) => {
        const otherUsername = message.fromId === uid ? message.to : message.from;
        const otherUserId = message.fromId === uid ? message.toId : message.fromId;
        uniqueUsers[otherUserId] = {id: otherUserId, username: otherUsername}
      });
      // console.log(uniqueUsers)
      

      const uniqueUsersArray = Object.values(uniqueUsers)

      setAllChats(uniqueUsersArray)
      // console.log(allChats)

  }catch(error){
    console.error('messages error:', error);
    throw error;
  }}
  return (
    <View>
      {allChats.map((chat, index) => (
        <Text key={index} onPress={() => navigation.navigate('chat', {uid, selectedPlayerUid: chat.id, selectedPlayerUsername: chat.username, data})}>
          {chat.username}
        </Text>
      ))}
    </View>
  )
}

export default ConversationsScreen

const styles = StyleSheet.create({})