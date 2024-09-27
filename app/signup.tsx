import { Alert, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import logo from "../assets/images/logo.png"
import { SafeAreaView } from 'react-native-safe-area-context'
import downarrow from "../assets/images/downarrow.png"
import { TouchableOpacity } from 'react-native'
import googleIcon from "../assets/images/googleIcon.png"
import appleicons from "../assets/images/appleicon.png"
import { useRouter } from 'expo-router';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { auth } from "@/firebase";
import { Eye, EyeOff } from "lucide-react-native";
import { AuthErrorCodes, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {CountryPicker} from "react-native-country-codes-picker";

const validationSchema = z
  .object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().email().min(1, "Phone number is required!"),
    phone_number: z.string()
      .min(1, "Phone number is required!"),
    password: z.string().min(8, "Password too short!")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    pregnant: z.enum(['Pregnant', 'Not Pregnant'], {
      message: "Select an option!"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  })
  ;

const OptionSelector = ({ options, pregnant, onSelect } : { options: string[], pregnant: string, onSelect: any }) => {
  return (
    <View style={styles.optionContainer}>
      {options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            pregnant === option && styles.selectedOption
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const signup = () => {
  const router = useRouter();
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+256');

  const onSubmit = async () => {
    try {
      const { email, password } = getValues()
      await registerUser(email, password);
      Alert.alert('Registration successful!');
      router.push("/login");
    } catch (error: any) {
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        Alert.alert('This email is already associated with an account.');
      } else {
        console.error('Registration Error:', error);
        Alert.alert('An error occurred during registration.');
      }
    }
  }

  const { 
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    control
   } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
      pregnant: ""
    }
  });

  const saveToDb = async () => {
    const data = getValues()
    const { confirmPassword, ...dataToSave } = data

    console.log("Data to save:", dataToSave);
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });
      console.log("Response status:", response.status); // Log the response status

      if (response.ok) {
        console.log("User saved to database!")
      } else {
        console.error("Failed to save user to database:", await response.text());
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  const registerUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // The registered user
      const user = userCredential.user;
      Alert.alert("Confirm your email!")
      
      // Save to user to database
      saveToDb();

      await sendEmailVerification(user)

      router.push("/login")
  
      console.log('User registered:', user);
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (number.startsWith('0')) {
      number = number.substring(1);
    }

    const formattedNo = `+${countryCode}${number}`
    return formattedNo;
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 34, display: 'flex', paddingVertical: 17 }}>

      <KeyboardAvoidingView >
        <ScrollView showsVerticalScrollIndicator={false} >
          <View>
            <Image source={logo} style={{ height: 66, width: 65, objectFit: 'contain', alignSelf: 'center' }} />
            <Text style={{ color: '#E4258F', fontSize: 32, textAlign: 'center', fontWeight: 'bold', marginTop: 23 }}>Signup</Text>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' ,}}>
              <Text style={{ fontSize: 14, marginTop: 12, }}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/login' })} >
                <Text style={{ color: '#E4258F',fontWeight:'bold' }}> Login here</Text>
              </TouchableOpacity>
            </View>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Name</Text>
              <Controller
                control={control}
                render={({field: { value, onBlur, onChange }}) => (
                  <TextInput 
                    placeholder='Enter your name' 
                    value={value}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    style={{ borderColor: '#1E1E1E', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16 }} />
                )}
                name="name"
                rules={{ required: "Name is required!" }}
              />
              {errors.name && <Text className="text-red-500 text-sm">{errors.name?.message}</Text>}
              </View>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email Address</Text>
              <Controller
                control={control}
                render={({field: { value, onBlur, onChange }}) => (
                  <TextInput 
                    placeholder='Enter your Email address' 
                    keyboardType='email-address' 
                    value={value}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    className='border border-[#1E1E1E] px-[13px] py-[10px] text-[16px]'
                  />
                )}
                name="email"
                rules={{ required: "Email is required!" }}
              />
              {errors.email && <Text className="text-red-500 text-sm">{errors.email?.message}</Text>}
            </View>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Phone Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                  lang='en'
                  show={show}
                  pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    setShow(false);
                  }}
                />
                <Text
                  style={{ fontSize: 16, marginHorizontal: 8 }}
                  onPress={() => setShow(true)}
                >
                  {countryCode}
                </Text>

                <Controller
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <TextInput
                      placeholder="Enter your Phone Number"
                      keyboardType="number-pad"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(inputValue) => {
                        const formattedNumber = formatPhoneNumber(inputValue);
                        onChange(formattedNumber);
                      }}
                      style={{ borderColor: '#1E1E1E', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16, flex: 1 }}
                    />
                  )}
                  name="phone_number"
                  rules={{ required: "Phone number is required!" }}
                />
              </View>

              {errors.phone_number && <Text className="text-red-500 text-sm">{errors.phone_number?.message}</Text>}
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

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Confirm Password</Text>
              <View className='flex flex-row border border-[#1E1E1E] text-[16px] pt-4 px-[13px] py-[10px]'>
                <Controller
                  control={control}
                  render={({field: { value, onBlur, onChange }}) => (
                    <TextInput 
                      placeholder='Confirm Password' 
                      value={value}
                      secureTextEntry={hidePassword}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      className='outline-none'
                    />
                  )}
                  name="confirmPassword"
                />
                <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center', alignItems: 'center' }} onPress={() => setHidePassword(!hidePassword)}>
                  {hidePassword ? <Eye className='text-black' /> : <EyeOff className='text-black' />}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text className="text-red-500 text-sm">{errors.confirmPassword?.message}</Text>}
            </View>

            <View style={{ display: 'flex', gap: 6, marginTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Current Stage</Text>
              <Controller
                control={control}
                name="pregnant"
                render={({field: { value, onChange }}) => (
                  <OptionSelector 
                    options={['Pregnant', 'Not Pregnant']}
                    pregnant={value}
                    onSelect={onChange}
                  />  
                )}
              />
              {errors.pregnant && <Text className='text-red-500 text-sm'>{errors.pregnant.message}</Text>}
            </View>

          {/* buttons */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ borderColor: '#E4258F', borderWidth: 2, marginTop: 30, paddingHorizontal: 56, paddingVertical: 9, borderRadius: 5, }}>
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, textAlign: 'center' }}>Create Account</Text>
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
          <Text style={{ fontSize: 13, textAlign: 'center' }}>
            By creating an account, you agree to our Privacy Policy & Terms and Conditions
          </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signup

const styles = StyleSheet.create({
  // ... (existing styles)
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#FFC0CB',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  selectedOption: {
    backgroundColor: '#E4258F',
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})