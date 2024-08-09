import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom, atom } from 'jotai';
import { subTotalAtom } from './cart';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import { useAuth } from './context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { cartAtom } from './(tabs)/shop';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/queries';

interface RedirectParams {
  status: 'successful' | 'cancelled';
  transaction_id?: string;
  tx_ref: string;
}

const validationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    paymentNumber: z.string().length(9, "Please enter a valid phone number")
  })

export default function Payment() {
  const router = useRouter()
  const { plan, amount } = useLocalSearchParams();
  const [subTotal] = useAtom(subTotalAtom);
  const { user } = useAuth();
  const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) })

  const [cart, setCart] = useAtom(cartAtom);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      paymentNumber: "",
    }
  });

  const onSuccess = async() => {
    setCart([]);
    try {
      const products = cart;
      const userId = userData?.id

      const payload = {
        user_id: userId,
        products: products,
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const responseData = await response.json();
      console.log('Order created successfully:', responseData);    
    } catch (error) {
      console.error("Error saving order", error);
    } finally {
      router.push("/shop")
    }
  }

  const handleOnRedirect = async(data: RedirectParams) => {
    if (data.status === 'successful') {
      await onSuccess();
      Alert.alert('Payment successful', 'Your payment was successful');
      router.push("/shop");
    } else {
      Alert.alert('Payment failed', 'Your payment was not successful');
    }
  };

  const generateTransactionRef = (length: number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', display:'flex',gap:20, alignItems:'center',paddingHorizontal:20 ,}}>
      <Text style={{fontSize:20, color:'#000000',fontWeight:'bold',marginTop:12}}>Payment Page for {plan} Plan</Text>
      {/** 
      <Text style={{fontSize:16, fontWeight:'semibold'}}>Email</Text>
      <Controller 
        control={control}
        name="email"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            placeholder="Email" 
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={{borderColor:'#0EA9DE', borderWidth:1, textAlign:'center',width:'100%',fontSize:16,padding:8}} 
          />
        )}
      />
      {errors.email && <Text style={{color:'red'}}>{errors.email.message}</Text>}

      <Text style={{fontSize:16, fontWeight:'semibold'}}>Type the contact you would like to pay with (256*******)</Text>
      <Controller
        control={control}
        name="paymentNumber"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            placeholder="Payment number" 
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={{borderColor:'#0EA9DE', borderWidth:1, textAlign:'center',width:'100%',fontSize:16,padding:8}} 
          />
        )}
      />
      {errors.paymentNumber && <Text style={{color:'red'}}>{errors.paymentNumber.message}</Text>}
    */}
      <TouchableOpacity style={{backgroundColor:'#0EA9DE', borderRadius:10, padding:10,width:'100%'}} onPress={()=>router.push('/premium')}>
        <Text style={{fontSize:16, color:'white',textAlign:'center', fontWeight:"bold" }}>Amount to pay: UGX.{subTotal}</Text>
      </TouchableOpacity>

      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generateTransactionRef(10),
          authorization: 'FLWPUBK-89ca0b51778315670ea054141e32a17f-X',
          customer: {
            email: user?.email as string,
          },
          amount: subTotal,
          currency: 'UGX',
          payment_options: 'card'
        }}
      />
      {/**
      <Text style={{fontSize:16, textAlign:'center', marginTop:20}}>
        The incurring charges are not shown above and please input pin when prompted to (ZENGAPAY)
        The only available payment option is Mobile Money (Airtel or Mtn)
        Always cross check your checkout before placing your order please
      </Text>
       */}
    </View>
  );
}
