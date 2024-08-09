import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface planCardProps {
  title: string,
  price: number,
  features: string[],
  isSelected: boolean,
  onPress: any
}

const PlanCard = ({ title, price, features, isSelected, onPress } : planCardProps) => (
  <TouchableOpacity 
    style={[styles.planCard, isSelected && styles.selectedCard]} 
    onPress={onPress}
  >
    <Text style={styles.planTitle}>{title}</Text>
    <Text style={styles.planPrice}>UGX {price.toLocaleString()}</Text>
    {features.map((feature, index) => (
      <Text key={index} style={styles.planFeature}>• {feature}</Text>
    ))}
  </TouchableOpacity>
);

export default function More() {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);

  const handlePlanSelection = (planType: string, amount: string) => {
    router.push({
      pathname: '/payment',
      params: { plan: planType, amount: amount },
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.premiumBanner}>
          <Text style={styles.bannerTitle}>Your Wellness Deserves More</Text>
          <Text style={styles.bannerSubtitle}>Try MyFemiHub Premium</Text>
          <Text style={styles.bannerText}>We connect you to any service you need for your wellness</Text>
        </View>
        
        <Text style={styles.subheader}>Choose a Subscription Plan</Text>
        
        <PlanCard
          isSelected={isSelected}
          title="Personal Basic Plan"
          price={350000}
          features={[
            "24/7 unlimited consultation with a general medical doctor over the phone",
            "Once monthly regular checkups and review"
          ]}
          onPress={() => {
            handlePlanSelection('basic', '350,000')
            setIsSelected(true)
          }}
        />
        
        <PlanCard
          title="Personal Comprehensive Plan"
          price={600000}
          features={[
            "All basic features",
            "Medical scan review and recommendations",
            "Blood workup and profiling",
            "Twice monthly checkups and review",
            "Access to a community forum"
          ]}
          isSelected={isSelected}
          onPress={() => {
            handlePlanSelection('comprehensive', '600,000')
            setIsSelected(true)
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    textAlign: 'center',
  },
  premiumBanner: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderColor:'#0EA9DE',
    borderWidth:1

  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  bannerText: {
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0EA9DE',
  },
  selectedCard: {
    borderColor: '#0EA9DE',
    borderWidth: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  planFeature: {
    marginBottom: 5,
  },
});