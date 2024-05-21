import {
  View,
  Text,
  Button,
  StyleSheet,
  AppState,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  query,
  orderByChild,
  getDatabase,
  ref,
  get,
  set,
} from "@firebase/database";
import * as Location from "expo-location";
import getUser from "../functions/getUser";
import { useUID } from "../functions/UIDContext";
import { goToAppSettings } from "../functions/Notifications";
import {Slider} from '@miblanchard/react-native-slider';

const RankingScreen = ({ navigation }) => {
  // change logic to use a default radius of 10 miles (collect every user within a 10 mile raidus, then sort them by score)
  // modal to adjust the radius
  const { uid } = useUID();
  const [rankings, setRankings] = useState([]);
  const [rankedByScore, setRankedByScore] = useState(false);
  const [location, setLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [distance, setDistance] = useState(userData?.radius || 10)
  console.log(rankings)


  const distanceSlider = () =>{
    return (
      <View style={styles.sliderContainer}>
        <Text>up to how far do you want to view other players?</Text>
        <Text>{distance} miles</Text>
                <Slider
                    value={distance}
                    onValueChange={setDistance}
                    maximumValue = {100}
                    minimumValue={0}
                    step = {0.5}
                />
                <Button title="close" onPress={()=>setSliderVisible(false)} />
                
            </View>
    )
  }

  // Always call the hooks in the same order
  useEffect(() => {
    const initialize = async () => {
      await getLocationPermission();
      await fetchUserDataAndRankings();
    };

    initialize();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, [uid, distance]);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(status === "granted");
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === "granted");
    }
    setAppState(nextAppState);
  };

  const fetchUserDataAndRankings = async () => {
    if (!userData) {
      const data = await getUser({ uid });
      setUserData(data);
    }
    await getRankingsByDistance();
  };

  const updateUserLocation = async () => {
    const tempLocation = await Location.getCurrentPositionAsync({});
    setLocation(tempLocation.coords);
    const userLocation = {
      latitude: tempLocation.coords.latitude,
      longitude: tempLocation.coords.longitude,
    };
    await set(ref(getDatabase(), `users/${uid}/location`), userLocation);
  };

  // use radius to filter rankings returned by rankedbydistance, then rank the result by score

  // const getRankingsByScore = async () => {
  //   try {
  //     const dbRef = ref(getDatabase(), "users");
  //     const rankingsSnapshot = await get(query(dbRef, orderByChild("score")));
  //     if (rankingsSnapshot.exists()) {
  //       const rankingsData = rankingsSnapshot.val();
  //       const rankedUsers = Object.entries(rankingsData).map(([uid, data]) => ({
  //         uid,
  //         username: data.username,
  //         score: data.score,
  //       }));
  //       rankedUsers.sort((a, b) => b.score - a.score);
  //       setRankings(rankedUsers.filter((player) => player.uid !== uid));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getRankingsByDistance = async () => {
    try {
      await updateUserLocation();
      const dbRef = ref(getDatabase(), "users");
      const rankingsSnapshot = await get(
        query(dbRef, orderByChild("location"))
      );
      if (rankingsSnapshot.exists()) {
        const rankingsData = rankingsSnapshot.val();
        const rankedUsers = Object.entries(rankingsData)
          .map(([uid, data]) => {
            const userLocation = data.location;
            if (userLocation && location) {
              const playerDistance = getDistance(location, userLocation)
              if(playerDistance <= distance){
                return {
                  uid,
                  username: data.username,
                  score: data.score,
                  distance: playerDistance,
                };
              }
              
            }
            return null;
          })
          .filter((user) => user !== null);
        rankedUsers.sort((a, b) => b.score - a.score);
        setRankings(rankedUsers.filter((player) => player.uid !== uid));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDistance = (point1, point2) => {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const { latitude: lat1, longitude: lon1 } = point1;
    const { latitude: lat2, longitude: lon2 } = point2;
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    const distanceMiles = distanceKm * 0.621371;
    return Number(distanceMiles.toFixed(2));
  };

  const toggleRankingOrder = () => {
    setRankedByScore((prev) => !prev);
  };

  if (hasLocationPermission === null) {
    return <Text>Loading...</Text>;
  }

  if (hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Permission to access location was denied</Text>
        <Button title="Enable location" onPress={goToAppSettings} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rankings</Text>
      {sliderVisible ? null: rankings.map((player, index) => (
        <View key={index} style={styles.playerContainer}>
          <Text
            onPress={() =>
              navigation.navigate("chat", {
                uid,
                selectedPlayerUid: player.uid,
                selectedPlayerUsername: player.username,
                username: userData.username,
              })
            }
            style={styles.playerText}
          >
            {player.username}:{" "}
            {player.score +"," ?? "loading"}
            {player.distance +" miles away" ?? "loading"}
          </Text>
          <Button
            title="Request Match"
            onPress={() =>
              navigation.navigate("requests-send", {
                username: userData.username,
                selectedPlayerUsername: player.username,
                uid,
                selectedPlayerUid: player.uid,
              })
            }
          />
        </View>
        
      ))}

      {sliderVisible ? distanceSlider(): null}
      {sliderVisible ? null: <Button title="toggle distance?" onPress={()=>setSliderVisible(true)}/>}
      {/* <Button
        title={rankedByScore ? "Rank by Distance" : "Rank by Score"}
        onPress={toggleRankingOrder}
        style={styles.toggleButton}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  playerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  toggleButton: {
    marginTop: 20,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
},
});

export default RankingScreen;
