import { StyleSheet, Text, View, Button } from "react-native";
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
  // const request = {
  //   timestamp: new Date().toISOString(),
  //   from: username,
  //   to: selectedPlayerUsername,
  //   fromId: uid,
  //   toId: selectedPlayerUid,
  //   specialRules: textArea,
  //   status: "pending",
  // };

  // const sendRequest = async () => {
  //   await push(ref(getDatabase(), `requests/${uid}`), request);
  //   await push(ref(getDatabase(), `requests/${selectedPlayerUid}`), request);
  //   setTextArea("")
  // }

  // const acceptRequest = async () => {

  // }
  // const declineRequest = async () => {}
  // const closeRequest = async () => {}
  const collectRequests = async () => {
    try {
      const dbRef = ref(getDatabase(), `requests/${uid}`);
      const userRequestSnapshots = await get(dbRef);

      userRequestsDictionary = {};

      userRequestSnapshots.forEach((requestSnapshot) => {
        const request = requestSnapshot.val();
        const RequestUsername = request.to;
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
    <View>
      {allRequests.map((request, index) => (
        <Text
          key={index}
          onPress={() =>
            navigation.navigate("chat", {
              uid,
              selectedPlayerUid: request.id,
              selectedPlayerUsername: request.username,
              username,
            })
          }
        >
          {request.username}
          <Button
            title="view request"
            onPress={() =>
              navigation.navigate("requests-view", {
                username,
                selectedPlayerUsername: request.username,
                uid,
                selectedPlayerUid: request.id,
              })
            }
          />
        </Text>
      ))}
    </View>
  );
};

export default MatchRequestsScreen;
