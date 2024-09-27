import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/firebase';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { FlutterwaveInit } from 'flutterwave-react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isSubscribed: boolean;
  setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  /** 
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/msubscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: user?.email })
        });
        const body = await response.json();
        
        if (!response.ok) console.error("Error fetching subscription", body)
        console.log("Response: ", body)

        if (body.status === "active") {
          setIsSubscribed(true)
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error: ", error)
      }
    }

    fetchSubscriptionStatus();
  }, [user]);
  */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [router]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const savedUseBio = await AsyncStorage.getItem('useBio');
        if (savedUseBio && JSON.parse(savedUseBio)) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access the app',
            fallbackLabel: 'Enter device PIN',
          });

          if (result.success) {
            setIsAuthenticated(true);
          } else {
            Alert.alert('Authentication Failed', 'You are not authorized to access the app.');
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You are not authorized to access this app.</Text>
      </View>
    );
  }


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isSubscribed, setIsSubscribed }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
