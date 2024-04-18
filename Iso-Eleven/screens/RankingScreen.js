import { View, Text, Button } from "react-native";
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

const RankingScreen = ({ navigation, route }) => {
  const { uid, data } = route.params;
  const { username } = data;
  const [rankings, setRankings] = useState([]);
  const [rankedByScore, setRankedByScore] = useState(false);
  const [location, setLocation] = useState(null);


  useEffect(() => {
    if (rankedByScore) {
      getRankingsByScore();
    } else {
      getRankingsByDistance();
    }
  }, [rankings]);

  const updateUserLocation = async () => {
    let tempLocation = await Location.getCurrentPositionAsync({});
    setLocation(tempLocation.coords);

    const userLocation = {
      latitude: tempLocation.coords.latitude,
      longitude: tempLocation.coords.longitude,
    };
    await set(ref(getDatabase(), `users/${uid}/location`), userLocation);
  };
  const getRankingsByScore = async () => {
    try {
      const dbRef = ref(getDatabase(), "users");
      const rankingsSnapshot = await get(query(dbRef, orderByChild("score")));

      if (rankingsSnapshot.exists()) {
        const rankingsData = rankingsSnapshot.val();
        const rankedUsers = Object.entries(rankingsData).map(
          ([uid, rankingsData]) => ({
            uid: uid,
            username: rankingsData.username,
            score: rankingsData.score,
          })
        );
        rankedUsers.sort((a, b) => a.score - b.score);
        setRankings(rankedUsers.filter((player) => player.uid !== uid));
      }
    } catch (error) {
      console.log(error);
    }
    throw error;
  };

  const getDistance = (point1, point2) => {
    // Function to convert degrees to radians
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const { latitude: lat1, longitude: lon1 } = point1;
    const { latitude: lat2, longitude: lon2 } = point2;
    // console.log(lat2)

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
    const distanceKm = R * c; // Distance in kilometers
    const distanceMiles = distanceKm * 0.621371; // Convert to miles
    return Number(distanceMiles.toFixed(2));
  };

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
          .map(([uid, userData]) => {
            const userLocation = userData.location;
            if (userLocation && location) {
              return {
                uid: uid,
                username: userData.username,
                distance: getDistance(location, userLocation),
              };
            }
            return null;
          })
          .filter((user) => user !== null); // Filter out null values
        rankedUsers.sort((a, b) => a.score - b.score);
        setRankings(rankedUsers.filter((player) => player.uid !== uid));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const toggleRankingOrder = () => {
    setRankedByScore(!rankedByScore); // Toggle rankedByScore state
  };

  return (
    <View>
      {rankings.map((player, index) => (
        <Text
          key={index}
          onPress={() =>
            navigation.navigate("chat", {
              uid,
              selectedPlayerUid: player.uid,
              selectedPlayerUsername: player.username,
              data,
            })
          }
        >
          {player.username}: {rankedByScore ? player.score : player.distance}
          
          <Button title="request match" onPress={()=>navigation.navigate('requests', {username, selectedPlayerUsername: player.username, uid, selectedPlayerUid: player.uid})}/>
          
        </Text>
      ))}
      <Button
        title={rankedByScore ? "Rank by distance" : "Rank by Score"}
        onPress={toggleRankingOrder}
      />
    </View>
  );
};

export default RankingScreen;
