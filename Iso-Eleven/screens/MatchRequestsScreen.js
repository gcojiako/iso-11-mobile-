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

// create requests library. able to send request through rankings screen and conversation screen
// display reuqests similar to the conversation screen, but only with accepted requests
// functions: send request, accept request, decline request, close request, display requests (shows status: pending or accepted)
// should be able to chat through requests screen
// closing a request should remove it from the list of requests and update the score of both users
const MatchRequestsScreen = ({ navigation, route }) => {
  const { uid, data } = route.params;
  const { username } = data;

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
  const collectRequests = async () =>  {
    try {
      const dbRef = ref(getDatabase(), `requests/${uid}`)

      const sentRequestsSnapshot = await get(
        query(dbRef, orderByChild('from'), equalTo(username))
      );
      const receivedRequestsSnapshot = await get(
        query(dbRef, orderByChild('to'), equalTo(username))
      );

      const sentRequestsArray = [];
      sentRequestsSnapshot.forEach((requestSnapshot) => {
        const request = requestSnapshot.val();
        sentRequestsArray.push(request);
      });
  
      const receivedRequestsArray = [];
      receivedRequestsSnapshot.forEach((requestSnapshot) => {
        const request = requestSnapshot.val();
        receivedRequestsArray.push(request);
      });

      const allRequestsSnapshot = [...sentRequestsArray, ...receivedRequestsArray]

      const uniqueRequests = {}
      allRequestsSnapshot.forEach((request) => {
        const RequestUsername = request.fromId === uid ? request.to : request.from;
        const RequestUserId = request.fromId === uid ? request.toId : request.fromId;
        uniqueRequests[otherUserId] = {id: RequestUserId, username: RequestUsername}
      });
      

      const uniqueRequestsArray = Object.values(uniqueRequests)

      setAllRequests(uniqueRequestsArray)
      // console.log(allChats)

  }catch(error){
    console.error('messages error:', error);
    throw error;
  }}

  return (
    <View>
      {allRequests.map((request, index) => (
        <Text key={index}>
          {request.username}
        </Text>
      ))}
    </View>
  )
}

export default MatchRequestsScreen

