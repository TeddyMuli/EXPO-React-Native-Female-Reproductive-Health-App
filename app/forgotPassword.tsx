import { Alert, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native'
import { useRouter } from 'expo-router';
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as SecureStore from 'expo-secure-store';
import { isSignInWithEmailLink, sendPasswordResetEmail, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { auth } from '@/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';

const validationSchema = z
  .object({
    email: z.string().email().min(1, "Email is required!")
  });

const forgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToast()

  const { 
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    control
   } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      email: ""
    }
  });

  const sendSignInLink = async () => {
    const email = getValues().email
    const actionCodeSettings = {
      url: "https://femihub-e7f9a.firebaseapp.com/",
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.femihub.ios'
      },
      android: {
        packageName: 'com.femihub.android',
        installApp: true,
        minimumVersion: '10'
      },
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      await AsyncStorage.setItem('emailForSignIn', email);
      Alert.alert('Sign-In link sent to your email.');
    } catch (error: any) {
      console.error('Error sending sign-in link:', error);
    }
  };

  const sendResetPasswordLink = async () => {
    const email = getValues().email;

    try {
      await sendPasswordResetEmail(auth, email);
      toast.show('Password reset link sent to your email.');
      router.push("/login")
    } catch (error: any) {
      console.error('Error sending password reset link:', error);
    }
    
  }
  
  return (
    <SafeAreaView style={{ flex: 1, }} >
      <View style={{ paddingHorizontal: 24}}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>
            My
          </Text>
          <Text style={{ color: '#E4258F', fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>FemiHub</Text>
        </View>
        <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 25 }}>Remember, this action is only possible if your email is logged in the device’s mail app, otherwise ,</Text> 
        <TouchableOpacity  onPress={()=>router.push('/signup')}><Text style={{ color: '#E4258F', fontSize: 14,textAlign:'center' }}>Create Account</Text>
        </TouchableOpacity>

        <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Email Address</Text>
          <Controller
            control={control}
            render={({field: { onChange, onBlur, value }}) => (
              <TextInput
                placeholder='Enter your email'
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                style={{ borderColor: '#1E1E1E', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16, marginTop: 15 }}
              />
            )}
            name="email"
            rules={{ required: "Email is required!" }}
          />
          {errors.email && <Text className="text-red-500 text-sm">{errors.email?.message}</Text>}
        </View>

        <TouchableOpacity style={{ borderColor: '#E4258F', borderWidth: 2, marginTop: 30, paddingHorizontal: 56, paddingVertical: 9, borderRadius: 5 }} 
          >
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className='text-[#E4258F] text-sm my-2'>login with password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default forgotPassword

const styles = StyleSheet.create({})