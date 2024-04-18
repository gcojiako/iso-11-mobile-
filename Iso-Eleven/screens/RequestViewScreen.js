import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
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

const RequestViewScreen = ({navigation, route}) => {
    const { username, selectedPlayerUsername, uid, selectedPlayerUid } = route.params;
    const [requestDetails, setRequestDetails] = useState([]);
    
    const collectRequests = async () =>  {
    const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`)

    const requestSnapshot = await get(dbRef)
    console.log(requestSnapshot)
      // console.log(sentRequestsArray, receivedRequestsArray) 

    //   const requestsArray = [];
    //   requestsSnapshot.forEach((requestSnapshot) => {
    //     const request = requestSnapshot.val();
    //     requestsArray.push(request);
    //   })
    //   console.log(requestsArray)
    };
    collectRequests();  
  return (
    <View>
      <Text>RequestViewScreen</Text>
    </View>
  )
}

export default RequestViewScreen

const styles = StyleSheet.create({})