import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import logo from "../assets/images/logo.png";
import { SafeAreaView } from 'react-native-safe-area-context';
//import downarrow from "../assets/images/downarrow.png"
import { TouchableOpacity } from 'react-native';
//import googleIcon from "../assets/images/googleIcon.png";
//import appleicons from "../assets/images/appleicon.png";
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthErrorCodes, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase';
import { Eye, EyeOff } from 'lucide-react-native';
//import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/queries';
import { signInWithPopup } from "firebase/auth";
import { useToast } from 'react-native-toast-notifications';
//import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const validationSchema = z
  .object({
    password: z.string().min(8, "Passoword too short!"),
    email: z.string().email().min(1, "Email is required!")
  })

const Login = () => {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);
  const toast = useToast();

  //const { data } = useQuery({ queryKey: ['user'], queryFn: () => getUser(getValues().email) })

  //const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    console.log("Login page")
  }, [])

  const [loading, setLoading] = useState(false);

  /** 
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
    });
  }, []);
  */

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

  const signInWithGoogle = async () => {
    /** 
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo", userInfo);
      setLoading(true);
  } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log(error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log(error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log(error)
      } else {
      }
  } finally {
    setLoading(false);
  }
    */
   console.log("Sign in with google")
  }

  const signInWithApple = async () => {
    try {
      setLoading(true);

      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in: ", user);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  const signInUser = async () => {
    const { email, password } = getValues();
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user?.emailVerified) {
        Alert.alert('Please verify your email before signing in.');
        return;
      }
  
      toast.show('Sign-in successful');
      router.push("/home")
      return user;

    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast.show("Wrong password", {
          type: "danger"
        })
      } else {
        try {
          const userData = await getUser(getValues().email);
          const { email: checkEmail, password: checkPassword } = getValues();
          
          //const salt = await BcryptReactNative.getSalt(10);
          //const hashedCheckPassword = await BcryptReactNative.hash(salt, checkPassword);
          //const isPasswordValid = await BcryptReactNative.compareSync(userData.password, hashedCheckPassword);
          
          if (userData) {
            const newFirebaseUser = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created on firebase");

            const newUser = newFirebaseUser.user
            toast.show("Confirm email!");
            await sendEmailVerification(newUser)

            console.log("New user created")
            return await signInUser();
          } else {
            Alert.alert("User does not exist");
          }
        } catch (error) {
          console.error('Error during sign-in:', error);
      } finally {
        setLoading(false);
      }
  }
}
  };

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
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>
              {loading ? "Logging in..." : 'Login'}
            </Text>
          </TouchableOpacity>

          {/** 
          <TouchableOpacity
            onPress={signInWithGoogle}
            className='border-2 border-[#E4258F] mt-[30px] mx-[26px] px-[26px] py-[9px] rounded-md flex flex-row items-center justify-around'
          >
            {!loading ? (
              <>
                <Image source={googleIcon} style={{ width: 32, height: 32, objectFit: 'cover' }} />
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Continue with Google </Text>
              </>
            ) : (
              <Text>Logging in...</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signInWithApple} 
            className='border-2 border-[#E4258F] mt-[30px] mx-[26px] px-[26px] py-[9px] rounded-md flex flex-row items-center justify-around'          
          >
            {!loading ? (
              <>
                <Image source={googleIcon} style={{ width: 32, height: 32, objectFit: 'cover' }} />
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Continue with Apple</Text>
              </>
            ) : (
              <Text>Logging in...</Text>
            )}
          </TouchableOpacity>
          */}

          <View className='flex flex-row justify-between items-center'>
            {/**<TouchableOpacity
              onPress={() => router.push("/passwordLessSignIn")}
            >
              <Text style={{ color: '#E4258F', fontSize: 12 }}>Passwordless SignIn</Text>
            </TouchableOpacity>*/}

            <TouchableOpacity
              onPress={()=>router.push('/forgotPassword')}
              style={{marginTop:10}}
            >
              <Text style={{ color: '#E4258F', fontSize: 12 }}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>router.push('/signup')}
              style={{marginTop:10}}
            >
              <Text style={{ color: '#E4258F', fontSize: 12 }}>Create Account?</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login
