import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Linking, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // throw new Error('Notification permissions not granted');
      console.log('Notification permissions not granted')
      return false
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
}


export function goToAppSettings (){
  Linking.openSettings();
};