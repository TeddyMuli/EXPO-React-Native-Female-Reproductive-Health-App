import { X } from 'lucide-react-native';
import React, { Dispatch, SetStateAction } from 'react';
import { Image, Modal, ScrollView, Text, View } from 'react-native';
import blog1 from "@/assets/images/blog1.png";
import { SafeAreaView } from 'react-native';

const BlogPost = ({ blog, setShowBlogPost } : { blog: any, setShowBlogPost: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <Modal>
      <SafeAreaView className='flex m-4'>
        <X className='text-black mr-auto mb-4' onPress={() => setShowBlogPost(false)} />

        <ScrollView contentContainerStyle={{ alignItems: "center", alignContent: "center" }} className='flex'>
          <Image source={blog?.image || blog1} className='w-[300px] h-[200px]' />
          <View className='my-4 mr-auto ml-8'>
            <Text className='text-xl font-semibold'>{blog?.title}</Text>
            <Text className='flex mt-4 max-w-[310px]'>{blog?.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default BlogPost;
