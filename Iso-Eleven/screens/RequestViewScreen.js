import { StyleSheet, Text, View, Button, Modal, Pressable, Alert } from 'react-native'
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
    const [waitingOnPlayers, setWaitingOnPlayers] = useState([])
    // console.log(waitingOnPlayers)

    useEffect(() => {
      collectRequestDetails();
      collectWaitingPlayers();
    }, [requestDetails]);
    
    const collectRequestDetails = async () =>  {
    const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`)
  

    const requestSnapshot = await get(dbRef)
    const requestDetailsVal = requestSnapshot.val()
    setRequestDetails(requestDetailsVal)
    };

    const collectWaitingPlayers = async () =>{
      const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/waitingOn`)
      const waitingOnPlayersSnapshot = await get(dbRef)
      const waitingOnPlayersVal = waitingOnPlayersSnapshot.val()
      setWaitingOnPlayers(waitingOnPlayersVal)
    }

    const toggleModal = () =>{
        setModalVisible(!modalVisible)
    }

    const calculateScores = (winner, loser, K=32) =>{
      // console.log("calculate scores is running")
      // Calculate expected scores
    const winnerElo = 1 / (1 + Math.pow(10, (loser - winner) / 400));
    const loserElo = 1 / (1 + Math.pow(10, (winner - loser) / 400));

    // Define the score for player A (1 for win)
    const Sa = 1;

    // Calculate the updated ratings
    const newWinnerElo = (winner + K * (Sa - winnerElo)).toFixed(2);
    const newLoserElo = (loser + K * ((1 - Sa) - loserElo)).toFixed(2);
      // console.log("new scores returned from calculate score: ", newWinnerElo, newLoserElo )
    return { newWinnerScore: newWinnerElo, newLoserScore: newLoserElo};
    }

    const updateScores = async (winner) =>{
      console.log("update scores is running")

      // update the scores according to the winner using elo
      const dbRef = ref(getDatabase(), `users/${uid}`)
      const dbRefPlayer = ref(getDatabase(), `users/${selectedPlayerUid}`)

      const userSnapshot = await get(dbRef)
      const playerSnapshot = await get(dbRefPlayer)

      const userDetails = userSnapshot.val()
      const playerDetails = playerSnapshot.val()
      console.log(userDetails)
      console.log(playerDetails)

      if (userDetails.username === winner){
        // console.log(winner, "is the winner")
        const { newWinnerScore, newLoserScore } = calculateScores(playerDetails.score, userDetails.score, 32)
        // console.log("winning score, and losing score: ", newWinnerScore, newLoserScore)
        set(ref(getDatabase(), `users/${uid}/score`), newWinnerScore)
        set(ref(getDatabase(), `users/${selectedPlayerUid}/score`), newLoserScore)

      }else{
        // console.log(playerDetails.username, "is the winner")
        const { newWinnerScore, newLoserScore } = calculateScores(playerDetails.score, userDetails.score, 32)
        // console.log("winning score, and losing score: ", newWinnerScore, newLoserScore)
        set(ref(getDatabase(), `users/${uid}/score`), newLoserScore)
        set(ref(getDatabase(), `users/${selectedPlayerUid}/score`), newWinnerScore)

      }
      
    }

    const closeRequest = async (winner) => {
        // asks the user if they won; store the winner in a variable
        // if user won, update the status accordingly: if user won or lost, but status is pending, change status to `${winner}...`
        // if user won or lost, but status is `${winner}..., change status to closed ONLY if winner === your winner variable
        const dbRef = ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/status`)
        const dbRefPlayer = ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}/status`)

        const statusSnapshot = await get(dbRef)
        const status = statusSnapshot.val()
      

        if(status ==="pending"){
          set(dbRef,`${winner}...`)
          set(dbRefPlayer,`${winner}...`)

          set(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/waitingOn`), [selectedPlayerUsername])
          set(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/waitingOn`), [selectedPlayerUsername])
          setWaitingOnPlayers([selectedPlayerUsername])

          toggleModal()
          
        }
        else if(status !==`${winner}...`){
          set(dbRef,`${winner}...`)
          set(dbRefPlayer,`${winner}...`)

          set(ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}/waitingOn`), [selectedPlayerUsername])
          set(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}/waitingOn`), [selectedPlayerUsername])
          setWaitingOnPlayers([selectedPlayerUsername])
          
          toggleModal()
        }
        else{
          if(status ===`${winner}...`){
            remove(ref(getDatabase(), `requests/${uid}/${selectedPlayerUid}`))
            remove(ref(getDatabase(), `requests/${selectedPlayerUid}/${uid}`))
            updateScores(winner)
            navigation.navigate('match-requests', {uid, username})
            
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
        Winner: {requestDetails.status}{"\n"}
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
            <Text style={styles.modalText} onPress={()=>closeRequest(username)}>{username}</Text>
            <Text style={styles.modalText} onPress={()=>closeRequest(selectedPlayerUsername)}>{selectedPlayerUsername}</Text>
            <Button title='close modal' onPress={toggleModal}/>

          </View>
        </View>
      </Modal>
      <Button title="close request?" onPress={()=>waitingOnPlayers.includes(username) ? toggleModal(): Alert.alert("must wait for other player")} />
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