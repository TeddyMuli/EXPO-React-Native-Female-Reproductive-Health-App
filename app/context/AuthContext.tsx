import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/firebase';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { FlutterwaveInit } from 'flutterwave-react-native';

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

  if (loading) {
    return (
      <View className='justify-center items-center'>
        <Loading />
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
