import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QuestionCard from '@/components/QuestionCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, getPosts, getUser } from '@/queries/queries';
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface NewPost {
  user_id: string;
  title: string;
  content: string;
}

interface PostResponse {
  message: string;
};

const validationSchema = z
  .object({
    title: z.string().min(1, "This field is required"),
    post: z.string().min(1, "This field is required")
  })

const createForumPost = async (newPost: NewPost): Promise<PostResponse> => {
  const response = await axios.post('/forum_posts', newPost);
  return response.data;
};

export default function App() {
  const queryClient = useQueryClient();

  const { data: usersData, error: usersError, isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: () => getAllUsers() })


  const mutation = useMutation<PostResponse, Error, NewPost>(createForumPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const onSubmit = (event: any) => {
    event.preventDefault();
    const formData = getValues()
    const newPost = {
      user_id: usersData?.id,
      title: formData.title,
      content: formData.post,
    };
    mutation.mutate(newPost);
  };

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: '',
      post: ''
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            We can connect and learn more from various past experiences and journeys
          </Text>
        </View>
        <View>
        <Controller
          control={control}
          name="title"
          render={({field: {value, onChange, onBlur}}) => (
            <TextInput
            style={styles.mainInput} 
            placeholder='Title' 
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          )}
        />
        {errors.title && <Text className='text-red-500'>{errors.title.message}</Text>}

        <Controller
          control={control}
          name="post"
          render={({field: {value, onChange, onBlur}}) => (
            <TextInput
            style={styles.mainInput} 
            placeholder='Your post here' 
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          )}
        />
        {errors.post && <Text className='text-red-500'>{errors.post.message}</Text>}

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className='p-3 bg-[#E4258F] rounded-xl w-[150px]'>
            <Text className='text-white text-xl font-medium text-center'>Post</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {posts?.map((post: any, index: number) => {
            const user = usersData?.find((user: any) => user.id === post.user_id);
            const userName = user ? user.name : 'Unknown User';

            return (
              <QuestionCard key={index} post={post} userName={userName} />
            )
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
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