import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
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

// create requests library. able to send request through rankings screen and conversation screen
// display reuqests similar to the conversation screen, but only with accepted requests
// functions: send request, accept request, decline request, close request, display requests (shows status: pending or accepted)
// should be able to chat through requests screen
// closing a request should remove it from the list of requests and update the score of both users
const MatchRequestsScreen = ({ navigation, route }) => {
  const { uid, username } = route.params;
  // console.log(username, uid)

  const [textArea, setTextArea] = useState("");
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    collectRequests();
  }, [allRequests]);
  const collectRequests = async () => {
    try {
      const dbRef = ref(getDatabase(), `requests/${uid}`);
      const userRequestSnapshots = await get(dbRef);

      userRequestsDictionary = {};

      userRequestSnapshots.forEach((requestSnapshot) => {
        const request = requestSnapshot.val();
        const RequestUsername = request.to === username ? request.from : request.to;
        const RequestUserId = request.toId === uid ? request.fromId : request.toId;
  

        userRequestsDictionary[RequestUserId] = {
          id: RequestUserId,
          username: RequestUsername,
        };
      });

      const uniqueRequestsArray = Object.values(userRequestsDictionary);
      setAllRequests(uniqueRequestsArray);
      // console.log(uniqueRequestsArray)
      // console.log(uniqueRequestsArray)
      // console.log(allRequests)
    } catch (error) {
      console.error("messages error:", error);
      throw error;
    }
  };
  //clicking on a request should open a modal with the request details: chat & accept/decline/close
  // view request -> option to close -> who won? -> update request status
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Requests</Text>
      <View style={styles.requestsContainer}>
        {allRequests.map((request, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("chat", {
                uid,
                selectedPlayerUid: request.id,
                selectedPlayerUsername: request.username,
                username,
              })
            }
            style={styles.requestItem}
          >
            <Text style={styles.requestUsername}>{request.username}</Text>
            <Button
              title="View Request"
              onPress={() =>
                navigation.navigate("requests-view", {
                  username,
                  selectedPlayerUsername: request.username,
                  uid,
                  selectedPlayerUid: request.id,
                })
              }
            />
          </TouchableOpacity>
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
    alignItems: "center", // Align items in the center horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center text horizontally
  },
  requestsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%", // Make requests container take full width
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%", // Make request item take full width
  },
  requestUsername: {
    fontSize: 18,
  },
});

export default MatchRequestsScreen;
