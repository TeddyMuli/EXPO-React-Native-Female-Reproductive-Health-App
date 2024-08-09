import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import calender from "../../assets/images/calender.png";
import femistore from "../../assets/images/femistore.png";
import moreHome from "../../assets/images/morehome.png";
import communityHome from "../../assets/images/communityHome.png";
import blog1 from "../../assets/images/blog1.png";
import blog2 from "../../assets/images/blog2.png";
import blog3 from "../../assets/images/blog3.png";
import { Href, useRouter } from 'expo-router';
import { getArticles, getUser } from "@/queries/queries";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import BlogPost from '@/components/BlogPost';

// Get the screen width
const screenWidth = Dimensions.get('window').width;
// Set card width to be half of the screen width minus some padding/margin
const cardWidth = (screenWidth - 60) / 2; // Adjusted for padding and margin

const cardsData = [
  { image: calender, heading: 'My Calendar', desc: 'Track your period', path: "/calender" },
  { image: femistore, heading: 'FemiHub Store', desc: 'Best for you', path: "/shop" },
  { image: communityHome, heading: 'Community', desc: 'Share Your Thoughts', path: "/community" },
  { image: moreHome, heading: 'More', desc: 'Dont be left out', path: "/more" },
];
const blogData = [
  { image: blog1, heading: "Women's health: Tips for staying healthy at any age", desc: "Women's health is important at all ages" },
  { image: blog2, heading: 'Motherhood: Tips for taking care of yourself and your family', desc: 'Motherhood is a rewarding experience, but it can also be challenging' },
  { image: blog3, heading: 'Pregnancy and nutrition', desc: 'What to eat and avoid' },
];

const home = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showBlogPost, setShowBlogPost] = useState(false);
  const [blog, setBlog] = useState({});

  const { user } = useAuth();

  const query = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) });
  const { data: articles, error: articlesError, isLoading: articlesLoading } = useQuery({ queryKey: ['articles'], queryFn: getArticles });

  let greeting
  let time = new Date().getHours()
  if (time < 12) {
    greeting = "Good morning"
  } else if (time < 18) {
    greeting = "Good afternoon"
  } else {
    greeting = "Good evening"
  }

  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.username}>{greeting} <Text className='text-[#E4258F]'>{query.data?.name} </Text>!</Text>
          <Text style={styles.dailyTip}>DAILY TIP</Text>
          <Text style={styles.tipTitle}>How to Boost Your Fertility</Text>
          <Text style={styles.tipDesc}>
            Exercise is a great way to improve your overall health and fertility. Aim for at least 30 minutes of moderate...
          </Text>
        </View>

        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Essentials for amazing women like you</Text>
          <View className='flex flex-row flex-wrap gap-3 mb-4'>
            {cardsData.map((item, index) => (
              <View key={index}>
                <TouchableOpacity onPress={() => router.push(item.path as Href<string | object>)}>
                  <View style={[styles.cardContainer, { width: cardWidth }]}>
                    <Image source={item.image} style={styles.cardImage} />
                    <Text style={styles.cardHeading}>{item.heading}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* blogs section */}
        <View style={{ gap: 20 }}>
          {articles?.map((item: any, index: number) => {
            return (
              <View key={index}>
                <TouchableOpacity 
                  key={index} 
                  onPress={() => {
                    setShowBlogPost(true);
                    setBlog(item)
                }}>
                  <View key={index} style={{
                    borderWidth: 2,
                    borderColor: '#E4258F', display: 'flex', alignItems: 'center', gap: 6,
                    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5
                  }}>
                    <Image source={item?.image || blog1} style={{ objectFit: 'cover', width: '90%' }} />
                    <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{item.title}</Text>
                    <Text style={{ color: '#00000099', fontSize: 13, textAlign: 'center' }}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
                {showBlogPost && <BlogPost setShowBlogPost={setShowBlogPost} blog={blog} />}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    display: 'flex',
    gap: 4,
    // alignItems: 'center',
  },
  dailyTip: {
    color: '#E4258F',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    color: '#00000099',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipTitle: {
    color: '#E4258F',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tipDesc: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  cardsSection: {
    marginTop: 26,
  },
  sectionTitle: {
    color: '#E4258F',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E4258F',
    borderRadius: 10,
    padding: 10,
    marginBottom: 0,
    marginTop: 24,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 86,
    resizeMode: 'cover',
  },
  cardHeading: {
    color: '#00000099',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  cardDesc: {
    color: '#00000099',
    textAlign: 'center',
  },
});
