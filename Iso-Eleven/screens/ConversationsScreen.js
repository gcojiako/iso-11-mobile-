import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { query, orderByChild, getDatabase, ref, get, equalTo } from "@firebase/database";
import getUser from '../functions/getUser';
import { useUID } from '../functions/UIDContext';

const ConversationsScreen = ({ navigation }) => {
  const { uid } = useUID();

  const [userData, setUserData] = useState(null);
  const [allChats, setAllChats] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDataAndCollectChats = async () => {
      if (!userData && isMounted) {
        try {
          const data = await getUser({ uid });
          if (isMounted) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      if (userData) {
        await collectChats();
      }
    };

    fetchUserDataAndCollectChats();

    return () => {
      isMounted = false;
    };
  }, [uid, userData]);

  const collectChats = async () => {
    if (userData) {
      try {
        const dbRef = ref(getDatabase(), `messages/${uid}`);

        const sentMessagesSnapshot = await get(
          query(dbRef, orderByChild('from'), equalTo(userData.username))
        );
        const receivedMessagesSnapshot = await get(
          query(dbRef, orderByChild('to'), equalTo(userData.username))
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

        const allMessagesSnapshot = [...sentMessagesArray, ...receivedMessagesArray];

        const uniqueUsers = {};
        allMessagesSnapshot.forEach((message) => {
          const otherUsername = message.fromId === uid ? message.to : message.from;
          const otherUserId = message.fromId === uid ? message.toId : message.fromId;
          uniqueUsers[otherUserId] = { id: otherUserId, username: otherUsername };
        });

        const uniqueUsersArray = Object.values(uniqueUsers);

        setAllChats(uniqueUsersArray);
      } catch (error) {
        console.error('Error collecting chats:', error);
      }
    }
  };

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
                userData,
              })
            }
          >
            <Text style={styles.chatUsername}>{chat.username}</Text>
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
  },
  chatItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
    textAlign: "center",
  },
  chatUsername: {
    fontSize: 18,
  },
});

export default ConversationsScreen;
