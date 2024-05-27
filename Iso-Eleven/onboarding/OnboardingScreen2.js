import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  Button,
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getDatabase, ref, set, get } from "@firebase/database";
import { useUID } from "../functions/UIDContext";
import defaultUserProfileImage from '../assets/images/defaultUserProfile.jpeg'

const resolveDefaultUserProfileImage = Image.resolveAssetSource(defaultUserProfileImage).uri

const OnboardingScreen2 = ({ navigation }) => {
  const { uid } = useUID();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermissionResult.status !== "granted") {
        Alert.alert(
          "Permission denied",
          "You need to grant camera permissions to upload photos."
        );
      }

      const galleryPermissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryPermissionResult.status !== "granted") {
        Alert.alert(
          "Permission denied",
          "You need to grant gallery permissions to upload photos."
        );
      }
    };

    requestPermissions();

    return () => {
      // Cleanup logic if needed
    };
  }, []);

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
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };

  const removeImage = (index) => {
    setProfileImage(null);
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
      } else {
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
      }
    } catch (e) {
      console.log(e);
      setModalVisible(false);
    }
  };

  const goBack = () => {
    navigation.navigate("onboarding", { uid: uid });
  };

  const next = async () => {
    try {
      if (!profileImage) {
        await set(ref(getDatabase(), `users/${uid}/profileImage`), resolveDefaultUserProfileImage);
      }else{
        await set(ref(getDatabase(), `users/${uid}/profileImage`), profileImage);
      }

      await set(ref(getDatabase(), `users/${uid}/onboardingComplete`), true);
      navigation.navigate("bottom-tabs", {
        screen: "Home",
        params: { uid: uid },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Please choose a picture for your profile
      </Text>
      <Button title="Upload Image" onPress={() => setModalVisible(true)} />
      <View style={styles.imageContainer}>
        {profileImage && (
          <TouchableOpacity onPress={() => removeImage()}>
            <Image source={{ uri: profileImage }} style={styles.image} />
          </TouchableOpacity>
        )}
      </View>
      {uploadModal()}
      <Button
        title={
          profileImage
            ? "Next"
            : "continue without a profile picture? (you can always choose one later)"
        }
        onPress={next}
      />
      <Button title="go back" onPress={goBack} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
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

export default OnboardingScreen2;
