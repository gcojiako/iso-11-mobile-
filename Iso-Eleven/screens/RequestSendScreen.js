import React, { useState, useEffect } from "react";
import { Alert, View, Text, Modal, Button, TextInput } from "react-native";
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

const OpenRequestModal = ({
  navigation,
  route
}) => {
  const { username, selectedPlayerUsername, uid, selectedPlayerUid } = route.params;

  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [endScore, setEndScore] = useState("");
  const [additionalRules, setAdditionalRules] = useState("");

  const sendRequest = async ({
    username,
    selectedPlayerUsername,
    uid,
    selectedPlayerUid,
    time,
    location,
    endScore,
    additionalRules,
  }) => {
    // Construct your request object using the provided parameters and additional modal inputs
    const request = {
      from: username,
      to: selectedPlayerUsername,
      fromId: uid,
      toId: selectedPlayerUid,
      time: time,
      location: location,
      endScore: endScore,
      additionalRules: additionalRules,
      status: "pending",
      waitingOn: [username, selectedPlayerUsername]
    };
    
    
    await set(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`), request);
    await set(ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}`), request);
  
    // Close the modal
    navigation.goBack();
   
  };


  return (
    <View style={{ marginTop: 22 }}>
      
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Time:</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="Enter time"
            />

            <Text>Location:</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />

            <Text>End Score:</Text>
            <TextInput
              value={endScore}
              onChangeText={setEndScore}
              placeholder="Enter end score"
            />

            <Text>Additional Rules:</Text>
            <TextInput
              value={additionalRules}
              onChangeText={setAdditionalRules}
              placeholder="Enter additional rules"
            />
            
            <Button title="Submit" onPress={() => {time && location && endScore ? sendRequest({ username, selectedPlayerUsername, uid, selectedPlayerUid, time, location, endScore, additionalRules }): Alert.alert("Please fill out all fields, additional rules are not needed")}} />
            <Button
        title="Close Modal"
        onPress={() => navigation.goBack()}
      />
          </View>
        </View>

      
    </View>
  );
};

export default OpenRequestModal;
