import { StyleSheet, Text, View, Button, Modal } from 'react-native'
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
    const [modalVisible, setModalVisible] = useState(false);
    const [winner, setWinner] = useState("")

    useEffect(() => {
      collectRequestDetails();
    }, [requestDetails]);
    
    const collectRequestDetails = async () =>  {
    const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`)

    const requestSnapshot = await get(dbRef)
    const requestDetails = requestSnapshot.val()
    setRequestDetails(requestDetails)
    };

    const ClosingModal = () => {
        return(
            modalVisible && 
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>This is a modal</Text>
            <Button title="Close Modal" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
        )
    }

    const closeRequest = async () => {
        // asks the user if they won; store the winner in a variable
        // if user won, update the status accordingly: if user won or lost, but status is pending, change status to `${winner}...`
        // if user won or lost, but status is `${winner}..., change status to closed ONLY if winner === your winner variable
        const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`)

        const requestSnapshot = await get(dbRef)
        const requestDetails = requestSnapshot.val()
        const requestStatus = requestDetails.status

        if(requestStatus ==="pending"){

        }
        if(requestStatus ==="waiting for response"){}
        if(requestStatus ==="closed"){}
        await set(dbRef, {status: "closed"})
    }
  return (
    <View>
      <Text>
        Sender: {requestDetails.from}{"\n"}
        Time: {requestDetails.time}{"\n"}
        Location: {requestDetails.location}{"\n"}
        Game to: {requestDetails.endScore}{"\n"}
        Request status: {requestDetails.status}{"\n"}
      </Text>
      <ClosingModal />
      <Button title="close request?" onPress={() => setModalVisible(!modalVisible)} />
    </View>
  )
}

export default RequestViewScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });