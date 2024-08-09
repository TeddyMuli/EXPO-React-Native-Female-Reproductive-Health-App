import {  Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import splashScreenIcon from "../assets/images/splashscreen6.jpg"
import { router, useRouter } from 'expo-router'
import { useFonts } from 'expo-font'
import { SafeAreaView } from 'react-native-safe-area-context'


const splashScreen6 = () => {
  const[fontsLoaded] = useFonts({
    'Amiri-bold': require('../assets/fonts/Amiri-Bold.ttf')
  })

  const router = useRouter()
  return (
  //  <SafeAreaView>
     <View style={{ flex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative', paddingHorizontal:20}}>
      <View>
        <Text style={{fontSize:24, fontWeight:700, textAlign:'center'}}> Community <Text style={{color:'#E4258F',fontSize:24, fontWeight:700}}>support</Text></Text>
        {/* <View style={{ backgroundColor: '#00000040',padding:10, height:400, width:400 }}> */}
          <Image source={splashScreenIcon} style={{ shadowColor: '#FFFFFF', borderColor: '#FFFFFF', objectFit: 'contain', height: 356, width: 353, }} />
        {/* </View> */}
        <Text style={{fontWeight:700, fontSize:18, textAlign:'center'}}>The app will provide a community support feature to help users connect with other users, share experiences and receive support.</Text>
      </View>

{/* buttons */}
      <View style={{display:'flex', alignItems:'center',position:'absolute', bottom:'5%', flexDirection:'row',justifyContent:'space-between',  width:'100%'}}>
        <TouchableOpacity  onPress={()=>router.replace('/passwordlesSignIn')}>
          <Text style={{color:'#E4258F', fontWeight:700, fontSize:20}}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>router.push('/passwordlesSignIn')}>
          <Text style={{color:'#E4258F', fontWeight:700, fontSize:20}}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
   
  )
}

export default splashScreen6

const styles = StyleSheet.create({

})