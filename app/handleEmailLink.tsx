import React, { useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Linking from "expo-linking";
import { useRouter } from 'expo-router';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HandleEmailLink = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLink = async () => {
      const url = await Linking.getInitialURL();
      if (url && isSignInWithEmailLink(auth, url)) {
        let email = await await AsyncStorage.getItem('emailForSignIn');
        if (!email) {
          router.push("/passwordlesSignIn")
        }

        try {
          await signInWithEmailLink(auth, email!, url);
          Alert.alert('Sign-in successful!');
          await AsyncStorage.removeItem('emailForSignIn');
          router.replace('/home');
        } catch (error) {
          console.error('Error signing in with email link:', error);
        }
      } else {
        router.replace('/login');
      }
    };

    handleLink();
  }, []);

  return (
    <View>
      <Text>Processing...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default HandleEmailLink;
