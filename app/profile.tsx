import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import profile from "../assets/images/profile.png"
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAuth } from './context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/queries';

const ProfileScreen = () => {
  const router = useRouter();
  const [isPregnant, setIsPregnant] = useState(false);

  const { user } = useAuth();
  const { data: userData, error, isLoading } = useQuery({ queryKey: [user], queryFn: () => getUser(user?.email) })

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.profileSection}>
        <Image
          source={profile}
          style={styles.avatar}
        />
        <Text style={styles.username}>{userData?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.syncSection}>
          <Text style={styles.syncText}>Last sync time:</Text>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.goalSection}>
        <View style={styles.goalHeader}>
          <Feather name="target" size={24} color="black" />
          <Text style={styles.goalHeaderText}>My goal</Text>
        </View>
        <View style={styles.goalButtons}>
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Track my period</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Try to conceive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Track my pregnancy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pregnancySection}>
        <View style={styles.pregnancyHeader}>
          <Text style={styles.pregnancyHeaderText}>Pregnancy option</Text>
          <Text style={styles.pregnancyDuration}>13 Weeks{'\n'}1 Day</Text>
        </View>
        <View style={styles.pregnancyToggle}>
          <Text style={styles.pregnancyToggleText}>My baby was born!</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FF69B4" }}
            thumbColor={isPregnant ? "#fff" : "#f4f3f4"}
            onValueChange={() => setIsPregnant(!isPregnant)}
            value={isPregnant}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.languageOption}>
        <FontAwesome name="language" size={24} color="black" />
        <Text style={styles.languageOptionText}>Language options</Text>
        <Ionicons name="arrow-forward-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.languageOption} onPress={()=>router.push('/settings')}>
        <Ionicons name="settings" size={24} color="black" />
        <Text style={styles.languageOptionText}>Settings</Text>
        <Ionicons name="arrow-forward-outline" size={24} color="black" />
      </TouchableOpacity>

      <View className='mt-auto' style={styles.signOutContainer}>
        <TouchableOpacity onPress={signOutUser} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  syncSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap:10, 

    marginTop: 10,
  },
  syncText: {
    color: '#FF69B4',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goalSection: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  goalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  goalButton: {

    borderColor: '#e4258f',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 5,
    display: 'flex',
    // alignItems:'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  goalButtonText: {
    textAlign: 'center',
    fontSize: 13,
  },
  pregnancySection: {
    marginBottom: 20,
  },
  pregnancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pregnancyHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pregnancyDuration: {
    fontSize: 14,
    textAlign: 'right',
  },
  pregnancyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pregnancyToggleText: {
    fontSize: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  languageOptionText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  signOutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  signOutButton: {
    backgroundColor: '#E4258F',
    padding: 15,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default ProfileScreen;