import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Modal } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import getUser from '../functions/getUser';
import * as ImagePicker from "expo-image-picker";
import { getDatabase, ref, set, get } from "@firebase/database";

import defaultUserProfileImage from '../assets/images/defaultUserProfile.jpeg'

const resolveDefaultUserProfileImage = Image.resolveAssetSource(defaultUserProfileImage).uri


const HomeScreen = ({ navigation, route }) => {
  const { uid} = route.params;
  const auth = getAuth();
  const [userData, setUserData] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

// console.log(userData?.profileImage);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const data = await getUser({ uid });
        if (isMounted) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [uid, profileImage])

  const handleSignOut = () => {
    signOut(auth).then(() => navigation.navigate("login-signup"));
  }


  // make the uploaded image a touchable opacity where clicking it gives you the ability change your profile image
  const uploadModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Choose an option</Text>
            <Button
              title="Upload from Camera"
              onPress={() => uploadImage("camera")}
            />
            <Button
              title="Upload from Gallery"
              onPress={() => uploadImage("gallery")}
            />
            <Button
              title="Use Default Photo"
              onPress={() => uploadImage("default")}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };

  const saveImage = async (image) => {
    try {
      setProfileImage(image);
      setModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.profileImage,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }else if (mode === "default"){
        setProfileImage(resolveDefaultUserProfileImage)
        await set(ref(getDatabase(), `users/${uid}/profileImage`), profileImage)
        setModalVisible(false);
        return
      }
       else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.cancelled) {
        await saveImage(result.assets[0].uri);
        await set(ref(getDatabase(), `users/${uid}/profileImage`), profileImage)
      }
    } catch (e) {
      console.log(e);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.signOutButtonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      {userData && (
        <React.Fragment>
          {uploadModal()}
          <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: userData.profileImage }} style={styles.userPhoto} />
          </TouchableOpacity>
          </View>
          
          
          <Text style={styles.title}>Welcome, {userData.username}</Text>
          <Text style={styles.subtitle}>Your Score: {userData.score}</Text>
        </React.Fragment>
        
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  signOutButtonContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50, // Assuming the photo is square, adjust border radius as needed
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default HomeScreen;

//include world rankings attribute
