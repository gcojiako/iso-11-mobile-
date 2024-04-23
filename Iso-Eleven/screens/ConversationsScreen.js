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
    <View style={styles.container}>
      <Text style={styles.title}>Conversations</Text>
      <View style={styles.chatsContainer}>
        {allChats.map((chat, index) => (
          <Text
            key={index}
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate("chat", {
                uid,
                selectedPlayerUid: chat.id,
                selectedPlayerUsername: chat.username,
                data,
              })
            }
          >
            <Text style={styles.chatUsername}>{chat.username}</Text>
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center", // Align items in the center horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center text horizontally
  },
  chatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%", // Make chats container take full width
  },
  chatItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%", // Make chat item take full width
    textAlign: "center", // Center text horizontally
  },
  chatUsername: {
    fontSize: 18,
  },
});

export default ConversationsScreen
