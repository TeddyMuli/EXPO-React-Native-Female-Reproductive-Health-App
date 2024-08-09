import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useAtom, atom } from 'jotai';
import { cartAtom } from './(tabs)/shop';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from './context/AuthContext';
import Loading from '@/components/Loading';

export const subTotalAtom = atom(0)

const Cart = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [subTotal, setSubTotal] = useAtom(subTotalAtom);

  const [cart, setCart] = useAtom(cartAtom);
  const parsePrice = (priceString: string) => {
    return parseFloat(priceString.replace(/,/g, ''));
  };

  const subtotal = cart.reduce((total, item) => {
    const itemPrice = parsePrice(item.price);
    return total + itemPrice * item.quantity;
  }, 0);

  useEffect(() => {
    setSubTotal(subtotal);
  }, [subtotal])

  const updateQuantity = (index: number, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += delta;

      // Prevent the quantity from going below 1
      if (updatedCart[index].quantity < 1) {
        updatedCart[index].quantity = 1;
      }

      return updatedCart;
    });
  };

  const handleCheckout = async () => {
    try {
      if (!user) {        
        Alert.alert("Please log in to proceed with checkout.");

        return;
      }
      router.push("/payment")      
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <ScrollView className='my-8 mx-4'>
    <Text className='text-center text-xl font-semibold mb-4'>Shopping Cart</Text>
    {cart.map((product, index) => (
      <View key={index} className='flex-row items-center bg-white p-4 mb-4 rounded-lg shadow'>
        <Image source={{ uri: product.image }} className='w-20 h-20 rounded-lg' />
        <View className='flex-1 mx-4'>
          <Text className='text-lg font-medium'>{product.name}</Text>
          <View className='flex-row items-center mt-2'>
            <Pressable onPress={() => updateQuantity(index, -1)} className='p-2'>
              <FontAwesome name='minus' size={16} color='black' />
            </Pressable>
            <Text className='mx-2'>{product.quantity}</Text>
            <Pressable onPress={() => updateQuantity(index, 1)} className='p-2'>
              <FontAwesome name='plus' size={16} color='black' />
            </Pressable>
            <Text className='ml-4 text-pink-500 font-semibold'>{`USh ${product.price}`}</Text>
          </View>
          <Pressable className='mt-2'>
            <Text className='text-pink-500'>Remove</Text>
          </Pressable>
        </View>
      </View>
    ))}
    <View className='mt-4 p-4 bg-white rounded-lg shadow'>
      <Text className='text-lg font-medium'>Subtotal</Text>
      <Text className='text-xl font-bold text-pink-500'>
        {`USh ${subtotal.toLocaleString()}`}
      </Text>
      <Pressable onPress={handleCheckout} className='bg-pink-500 py-3 mt-4 rounded-lg'>
        <Text className='text-white text-center font-semibold'>
          Checkout
        </Text>
      </Pressable>
    </View>
  </ScrollView>
  );
}

export default Cart;
