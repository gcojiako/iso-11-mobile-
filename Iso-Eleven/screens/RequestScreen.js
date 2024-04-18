import React, { useState, useEffect } from "react";
import { View, Text, Modal, Button, TextInput } from "react-native";
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
    };
    
    // Perform actions with the request object (e.g., send to database)
    console.log("Request:", request);
  
    await push(ref(getDatabase(), `requests/${uid}`), request);
    await push(ref(getDatabase(), `requests/${selectedPlayerUid}`), request);
  
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
            
            <Button title="Submit" onPress={() => sendRequest({ username, selectedPlayerUsername, uid, selectedPlayerUid, time, location, endScore, additionalRules })} />
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
