import { StyleSheet, Text, View, Button, Modal, Pressable } from 'react-native'
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
    remove
  } from "@firebase/database";

const RequestViewScreen = ({navigation, route}) => {
    const { username, selectedPlayerUsername, uid, selectedPlayerUid } = route.params;
    const [requestDetails, setRequestDetails] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    // const [winner, setWinner] = useState("")

    useEffect(() => {
      collectRequestDetails();
    }, [requestDetails]);
    
    const collectRequestDetails = async () =>  {
    const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`)
  

    const requestSnapshot = await get(dbRef)
    const requestDetailsVal = requestSnapshot.val()
    setRequestDetails(requestDetailsVal)
    };

    const toggleModal = () =>{
        setModalVisible(!modalVisible)
    }

    const closeRequest = async (winner) => {
        // asks the user if they won; store the winner in a variable
        // if user won, update the status accordingly: if user won or lost, but status is pending, change status to `${winner}...`
        // if user won or lost, but status is `${winner}..., change status to closed ONLY if winner === your winner variable
        const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/status`)
        const dbRefPlayer = ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}/status`)

        const statusSnapshot = await get(dbRef)
        const status = statusSnapshot.val()

        if(status ==="pending" || status ===`undecided`){
          set(dbRef,`${winner}...`)
          set(dbRefPlayer,`${winner}...`)
        }else{
          if(status ===`${winner}...`){
            remove(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`))
            remove(ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}`))
            //update scores
            
          }else{
            set(dbRef,`undecided`)
            set(dbRefPlayer,`undecided`)
          }
        }
        // if status is pending, update winner. if winner does not agree, update to undecided. if status is undecided then repeat until winners agree
        
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please select the winner</Text>
            <Text style={styles.modalText} onPress={()=>closeRequest(username)}>username</Text>
            <Text style={styles.modalText} onPress={()=>closeRequest(selectedPlayerUsername)}>selectedPlayerUsername</Text>
            <Button title='close modal' onPress={toggleModal}/>

          </View>
        </View>
      </Modal>
      <Button title="close request?" onPress={toggleModal} />
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