import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import logo from "../assets/images/logo.png";
import { SafeAreaView } from 'react-native-safe-area-context';
import downarrow from "../assets/images/downarrow.png"
import { TouchableOpacity } from 'react-native';
import googleIcon from "../assets/images/googleIcon.png";
import appleicons from "../assets/images/appleicon.png";
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthErrorCodes, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { Eye, EyeOff } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/queries';
import bcrypt from 'react-native-bcrypt';

const validationSchema = z
  .object({
    password: z.string().min(8, "Passoword too short!"),
    email: z.string().email().min(1, "Email is required!")
  })

const Login = () => {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);
  const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => getUser(getValues().email) })

  const { 
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty }
   } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const hashPassword = (password: string) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
        } else {
          resolve(hashedPassword);
        }
      });
    });
  };

  const signInUser = async () => {
    const { email, password } = getValues();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user?.emailVerified) {
        Alert.alert('Please verify your email before signing in.');
        return;
      }
  
      console.log('Sign-in successful');
      router.push("/home")
      return user;

    } catch (error: any) {
      if (error.code === AuthErrorCodes.NULL_USER) {
        const { email: checkEmail, password: checkPassword } = getValues();
        const hashedCheckPassword = await hashPassword(checkPassword);
        
        if ((userData.email === checkEmail) && (userData.password === hashedCheckPassword)) {
          const newFirebaseUser = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = newFirebaseUser.user
          await sendEmailVerification(newUser)

          console.log("New user created")
          return await signInUser();
        } else {
          Alert.alert("User does not exist");
        }
      } else {
        console.error('Error during sign-in:', error);
      }
    }
  };


  const onSubmit = async () => {
    /**
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Source': 'mobile'
        },
        body: JSON.stringify(getValues())
      })
    } catch (error) {
      console.error("Error: ", error)
    }
    */
   router.push("/home")
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 34, display: 'flex', paddingVertical: 17 }}>

      <KeyboardAvoidingView >
        <ScrollView showsVerticalScrollIndicator={false} >
          <View>
            <Image source={logo} style={{ height: 66, width: 65, objectFit: 'contain', alignSelf: 'center' }} />
            <Text style={{ color: '#E4258F', fontSize: 32, textAlign: 'center', fontWeight: 'bold', marginTop: 23 }}>Login</Text>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email Address</Text>
              <Controller
                control={control}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextInput 
                    placeholder='Enter your Email address' 
                    keyboardType='email-address' 
                    value={value}
                    onChangeText={value => onChange(value)}
                    onBlur={onBlur}
                    style={{ borderColor: '#1E1E1E', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16 }} />
                )}
                name="email"
                rules={{ required: "Email is required!" }}
              />
              {errors.email && <Text className="text-red-500 text-sm">{errors.email?.message}</Text>}
            </View>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
              <View className='flex flex-row border border-[#1E1E1E] text-[16px] px-[13px] py-[10px] w-full'>
                <Controller
                  control={control}
                  render={({field: { value, onBlur, onChange }}) => (
                    <TextInput 
                      placeholder='Enter your Password'
                      value={value}
                      onBlur={onBlur}
                      secureTextEntry={hidePassword}
                      onChangeText={value => onChange(value)}
                      className='outline-none'
                    />
                  )}
                  name="password"
                />
                <TouchableOpacity className='ml-auto text-black justify-center items-center' onPress={() => setHidePassword(!hidePassword)}>
                  {hidePassword ? <Eye className='text-black' /> : <EyeOff className='text-black' />}
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 text-sm">{errors.password?.message}</Text>}
            </View>
          </View>

          {/* buttons */}
          <TouchableOpacity onPress={handleSubmit(signInUser)} style={{ borderColor: '#E4258F', borderWidth: 2, marginTop: 30, paddingHorizontal: 56, paddingVertical: 9, borderRadius: 5, }}>
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ borderColor: '#E4258F', borderWidth: 2, marginTop: 30, paddingHorizontal: 26, paddingVertical: 9, borderRadius: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <Image source={googleIcon} style={{
              width: 32, height: 32, objectFit: 'cover'
            }} />
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Continue with Google </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ borderColor: '#E4258F', borderWidth: 2, marginTop: 30, paddingHorizontal: 26, paddingVertical: 9, borderRadius: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <Image source={appleicons} style={{ width: 32, height: 32, objectFit: 'cover' }} />
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, }}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>router.push('/passwordlesSignIn')} style={{marginTop:10, }}><Text style={{ color: '#E4258F', fontSize: 12 }}>Forgot Password ?</Text></TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})