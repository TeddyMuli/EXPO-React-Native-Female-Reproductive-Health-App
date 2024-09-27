import { useAuth } from '@/app/context/AuthContext';
import { getUser } from '@/queries/queries';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { ChevronLeft, SendHorizontal } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text } from 'react-native';
import { TextInput, View } from 'react-native';

export const messageAtom = atom("");

const Chat = ({ setShowChat } : { setShowChat: any }) => {
  const { user } = useAuth();
  //const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) });
  

  const [message, setMessage] = useAtom(messageAtom);
  let date =  new Date().toISOString();

  const sendMessage = async () => {
    const toSend = {
      user_id: 19,
      message: message,
      date: date
    }
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/chats/`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(toSend)
    });
    const body = await response.json()

    if (!response.ok) {
      console.error("Error saving message: ", body)
      return;
    } else {
      console.log("Message saved: ", body)
    }
    
    setMessage("");
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <ScrollView contentContainerStyle={{ justifyContent: "space-between", flex: 1 }} className='bg-black/10'>
        <View className='flex-1 justify-between my-8 mx-4'>
          <ChevronLeft onPress={() => setShowChat(false)} className='text-black mb-4'/>
          
          <View className=''>
            <View className="self-start my-2 p-3 bg-white rounded-3xl">
              <Text className='text-black max-w-[200px]' >Chat with your doctor</Text>
            </View>

            <View className="self-end my-2 p-3 bg-[#E4258F] rounded-3xl">
              <Text className='text-white max-w-[200px]' >Chat with your doctor</Text>
            </View>

            <View className='flex flex-row justify-center items-center rounded-full w-full bg-white p-3 mt-2'>
              <TextInput
                value={message}
                onChangeText={value => setMessage(value)}
                placeholder='Type message'
                className='outline-none mr-4'
              />
              <SendHorizontal onPress={sendMessage} className='text-black ml-auto' />
            </View>
          </View>
          </View>
      </ScrollView>
    </Modal>  
  );
}

export default Chat;
