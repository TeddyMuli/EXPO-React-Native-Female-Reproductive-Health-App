import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import splashImage from "../assets/images/splash.png"
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { useFonts } from 'expo-font';
import { useAuth } from './context/AuthContext'

const index = () => {
  const { user, setUser } = useAuth();
  const[fontsLoaded] = useFonts({
    'Amiri-bold': require('../assets/fonts/Amiri-Bold.ttf')
  })
  
const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.push("/home")
      } else {
        router.replace('/splashScreen3');
      }
    }, 3000); // Navigate after 3 seconds

    //return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style='dark' />
      <Image source={splashImage} height={129} width={138} style={{ marginBottom: 55 }}  />
      <Text style={{ fontWeight: 700, fontSize: 24, textAlign: 'center' }}>My <Text style={{ color: '#E4258F', textAlign: 'center' }}>Femihub</Text></Text>

    </View>
  )
}

export default index

const styles = StyleSheet.create({})
