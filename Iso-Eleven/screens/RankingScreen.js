import { View, Text, Button, StyleSheet, AppState } from "react-native";
import React, { useState, useEffect } from "react";
import { query, orderByChild, getDatabase, ref, get, set } from "@firebase/database";
import * as Location from "expo-location";
import getUser from "../functions/getUser";
import { useUID } from '../functions/UIDContext';
import { goToAppSettings } from "../functions/Notifications";

const RankingScreen = ({ navigation }) => {
  const { uid } = useUID();
  const [rankings, setRankings] = useState([]);
  const [rankedByScore, setRankedByScore] = useState(false);
  const [location, setLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

  // Always call the hooks in the same order
  useEffect(() => {
    const initialize = async () => {
      await getLocationPermission();
      await fetchUserDataAndRankings();
    };
    
    initialize();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [uid, rankedByScore]);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(status === 'granted');
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    }
    setAppState(nextAppState);
  };

  const fetchUserDataAndRankings = async () => {
    if (!userData) {
      const data = await getUser({ uid });
      setUserData(data);
    }
    rankedByScore ? await getRankingsByScore() : await getRankingsByDistance();
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

  const getRankingsByScore = async () => {
    try {
      const dbRef = ref(getDatabase(), "users");
      const rankingsSnapshot = await get(query(dbRef, orderByChild("score")));
      if (rankingsSnapshot.exists()) {
        const rankingsData = rankingsSnapshot.val();
        const rankedUsers = Object.entries(rankingsData).map(
          ([uid, data]) => ({
            uid,
            username: data.username,
            score: data.score,
          })
        );
        rankedUsers.sort((a, b) => b.score - a.score);
        setRankings(rankedUsers.filter((player) => player.uid !== uid));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRankingsByDistance = async () => {
    try {
      await updateUserLocation();
      const dbRef = ref(getDatabase(), "users");
      const rankingsSnapshot = await get(query(dbRef, orderByChild("location")));
      if (rankingsSnapshot.exists()) {
        const rankingsData = rankingsSnapshot.val();
        const rankedUsers = Object.entries(rankingsData)
          .map(([uid, data]) => {
            const userLocation = data.location;
            if (userLocation && location) {
              return {
                uid,
                username: data.username,
                distance: getDistance(location, userLocation),
              };
            }
            return null;
          })
          .filter((user) => user !== null);
        rankedUsers.sort((a, b) => a.distance - b.distance);
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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
      {rankings.map((player, index) => (
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
            {rankedByScore
              ? player.score ?? "loading"
              : player.distance ?? "loading"}
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
      <Button
        title={rankedByScore ? "Rank by Distance" : "Rank by Score"}
        onPress={toggleRankingOrder}
        style={styles.toggleButton}
      />
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
});

export default RankingScreen;
