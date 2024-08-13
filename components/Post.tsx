import { X, SendHorizontal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import anonprofile from "@/assets/images/anonprofile.png";
import { Image } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, getReplies } from '@/queries/queries';
import { Controller, useForm } from 'react-hook-form';

interface Reply {
  content: string; // Adjust based on your actual structure
}

const Post = ({ selectedPost, setShowPost, setSelectedPost } : { selectedPost: any, setShowPost: any, setSelectedPost: any }) => {
  const queryClient = useQueryClient();
  const { data: usersData, error: usersError, isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: () => getAllUsers() });

  const [sending, setSending] = useState(false);

  const user = usersData?.find((user: any) => user.id === selectedPost.user_id);
  const userName = user ? user.name : 'Unknown User';

  const { data: replies } = useQuery({ queryKey: ['replies'], queryFn: () => getReplies(selectedPost.id) })

  const {
    control, getValues, handleSubmit, formState: { errors }
  } = useForm({
    defaultValues: {
      reply: ""
    }
  });

  const sendReply = async (newReply: { user_id: number, content: string, post_id: string }): Promise<void> => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newReply)
      })
      if (!response.ok) {
        const body = await response.json();
        console.error("Error saving reply: ", body);
        throw new Error('Failed to save reply');
      }      
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    } finally {
      setSending(false)
    }
  };

  const { mutate, isError, isPending } = useMutation({
    mutationFn: (newReply: {user_id: number, content: string, post_id: string}) => sendReply(newReply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] })
    }
  });

  const onSubmit = () => {
    mutate({
      user_id: user.id,
      content: getValues().reply,
      post_id: selectedPost.id
    })
  }

  return (
    <ScrollView contentContainerStyle={{ justifyContent: "center", alignContent: "center", margin: 12 }}>
      <View className='flex'>
        <X className='text-black' onPress={() => {setShowPost(false), setSelectedPost({})}} />
        <View className='flex flex-row my-4'>
          <Image source={anonprofile} style={styles.profileImage} />
          <View style={styles.userInfoText}>
            <Text style={styles.usernameText}>{userName}</Text>
            <Text style={styles.spyUsernameText}>{selectedPost?.title}</Text>
          </View>
        </View>
        <Text style={styles.questionText}>
          {selectedPost?.content}
        </Text>
        <View>
          <Controller
            name="reply"
            control={control}
            rules={{ required: 'Reply is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-row justify-center items-center">
                <TextInput
                  placeholder="Type your reply"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="p-3"
                />
                <SendHorizontal onPress={handleSubmit(onSubmit)} className="text-[#888] ml-auto" />
              </View>
            )}
          />
          {errors.reply && <Text className='text-red-500'>{errors.reply.message}</Text>}
        </View>

        {/** Replies */}
        {replies?.map((reply: any, index: number) => {
          return (
            <View key={index}>
              <Text style={styles.questionText}>
                {reply?.content}
              </Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    padding: 20,
    backgroundColor: '#E4258F',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  mainInput: {
    height: 105, 
    marginHorizontal: 15, 
    marginTop: 20, 
    textAlign: 'center', 
    borderWidth: 1, 
    borderColor: '#0EA9DE', 
    borderRadius: 5,
    padding: 10,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#0EA9DE',
    borderWidth: 1
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    height: 47, 
    width: 47, 
    objectFit: 'contain'
  },
  userInfoText: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  spyUsernameText: {
    color: '#E4258F',
    fontSize: 14,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4258F',
    borderRadius: 5,
    padding: 10,
    color: '#333',
    marginBottom: 10,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    color: '#888',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    marginLeft: 5,
    color: '#888',
  },
});


export default Post;
