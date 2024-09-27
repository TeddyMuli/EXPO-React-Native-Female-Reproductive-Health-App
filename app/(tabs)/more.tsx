import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { useAuth } from '../context/AuthContext';

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
    <Text style={styles.planPrice}>UGX {price.toLocaleString()} per month</Text>
    {features.map((feature, index) => (
      <Text key={index} style={styles.planFeature}>• {feature}</Text>
    ))}
  </TouchableOpacity>
);

export default function More() {
  const { user } = useAuth();

  const router = useRouter();
  const toast = useToast();

  const [isSelected, setIsSelected] = useState(false);
  const [plan, setPlan] = useState({
    plan_id: "",
    amount: 0
  });

  const subscribe = async () => {
    try {
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY || "FLWSECK-1873706b5bade4d31f75f944085fbc70-187ecd2e1a4vt-X"}`
        },
        body: JSON.stringify({
          tx_ref: `tx-${Date.now()}`,
          amount: plan.amount,
          currency: "UGX",
          payment_plan: plan.plan_id,
          redirect_url: "https://femihub.com",
          customer: {
            email: user?.email,
          }
        })
      });

      const body = await response.json();
      if (response.ok) {
        Linking.openURL(body.data.link);

        console.log("Response: ", body)
      } else {
        toast.show("Error subscribing", {
          type: "danger",
          placement: "bottom",
          duration: 4000,
          animationType: "zoom-in",
        })
        console.error("Error subscribing: ", body)
      }
    } catch (error: any) {
      console.error("Error subscribing to plan: ", error)
    }
  }
  
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
          title="Bulamu Basic Subscription"
          price={40000}
          features={[
            "24/7 unlimited consultation with a general medical doctor over the phone",
            "Once monthly regular checkups and review"
          ]}
          onPress={() => {
            setPlan({
              plan_id: "125333",
              amount: 40000
            })
            setIsSelected(true)
          }}
        />
        
        <PlanCard
          title="Bulamu Premium Antenatal"
          price={65000}
          features={[
            "All basic features",
            "Medical scan review and recommendations",
            "Blood workup and profiling",
            "Twice monthly checkups and review",
            "Access to a community forum"
          ]}
          isSelected={isSelected}
          onPress={() => {
            setPlan({
              plan_id: "125334",
              amount: 65000
            })
            setIsSelected(true)
          }}
        />

        <TouchableOpacity onPress={subscribe} className='p-3 rounded-xl justify-center items-center bg-blue-500'>
          <Text className="text-white">Subscribe</Text>
        </TouchableOpacity>
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