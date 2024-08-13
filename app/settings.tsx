import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Share, Platform, Linking } from 'react-native';
import SettingSection from '@/components/settings/SettingSection';
import { Ionicons } from '@expo/vector-icons';
import * as Settings from '@/components/settings/items/Items';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/queries/queries';

const sections = [
  {
    title: 'Reminders',
    icon: <Ionicons name="notifications" size={24} color="black" />,
    items: [
      { title: 'Cycle reminders', id: 'cycleReminders' },
      { title: 'Medicine reminder', id: 'medicineReminder' },
      { title: 'Contraception reminders', id: 'contraceptionReminders' },
      { title: 'Meditation  reminder', id: 'meditationReminder' },
      { title: 'Daily logging reminders', id: 'dailyLoggingReminders' },
      { title: 'Tracking reminder', id: 'trackingReminder' },
      { title: 'Secret reminders', id: 'secretReminders' }
    ],
  },
  {
    title: 'Personal Data',
    icon: <Ionicons name="star" size={24} color="black" />,
    items: [
      //{ title: 'Your name', id: 'yourName' },
      //{ title: 'Secure access (PIN)', id: 'secureAccess' },
      //{ title: 'Themes', id: 'themes' },
      { title: 'Calendar view', id: 'calenderView' }
    ],
  },
  {
    title: 'My Data',
    icon: <Ionicons name="folder" size={24} color="black" />,
    items: [
      { title: 'Back up data', id: 'backupData' },
      { title: 'Restore Data', id: 'restoreData' },
      { title: 'Delete app data', id: 'deleteData' },
    ],
  },
  {
    title: 'Other',
    icon: <Ionicons name="settings-sharp" size={24} color="black" />,
    items: [
      { title: 'Upgrade to Premium', id: 'upgradePremium' },
      { title: 'Remove ads', id: 'removeAds' },
      { title: 'Restore the ad-free version', id: 'adFree' },
      { title: 'Share with friends', id: 'share' },
      //{ title: 'Help and feedback', id: 'help' },
      { title: 'Privacy', id: 'privacy' },
      { title: 'Rate app', id: 'rating' }
    ],
  },
];

const CommonHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="chevron-back-outline" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
)

const SettingsScreen = () => {
  const { user } = useAuth();
  const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) })

  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourappname';
  const appStoreUrl = 'https://apps.apple.com/app/idYOUR_APP_ID';

  const ratePlayStoreUrl = 'market://details?id=com.yourappname';
  const ratAappStoreUrl = 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID?action=write-review';

  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null); 

  const rateApp = async () => {
    const url = Platform.OS === 'android' ? playStoreUrl : appStoreUrl;
  
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert('Sorry, something went wrong. Unable to open the store.');
    }
  };

  const openWebsite = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const shareApp = async () => {
    const url = Platform.OS === 'android' ? playStoreUrl : appStoreUrl

    try {
      const result = await Share.share({
        message: `Check out this amazing app: FemiHub - ${url}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with: ", result.activityType)
        } else {
          console.log("Shared successfully!")
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed!")
      }
    } catch (error) {
      console.error('Error sharing the app:', error);
    }
  }

  const handleItemPress = (id: string) => {
    if (id === 'upgradePremium' || id === "removeAds" || id === "adFree") {
      router.push("/premium");      
    } else if (id === 'share') {
      shareApp();
    } else if (id === 'privacy') {
      openWebsite('https://www.example.com')
    } else if (id === 'rating') {
      rateApp();
    } else {
      setSelectedComponent(id);
    }
  };

  const renderComponent = () => {
    if (selectedComponent) {
      const componentKey = selectedComponent.charAt(0).toUpperCase() + selectedComponent?.slice(1);
      const Component = (Settings as any)[componentKey];
      
      if (Component) {
        return <Component userId={userData.id} />;
      } else {
        console.log('Unhandled item:', selectedComponent);
        return null;
      }
    }
  }

  return (
    <ScrollView>
      {selectedComponent ? (
        <View>
          <CommonHeader
            title={
              sections
                .flatMap(section => section.items)
                .find(item => item.id === selectedComponent)?.title || ''
            }
            onBack={() => setSelectedComponent(null)}
          />
          {renderComponent()}
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {sections.map((section) => (
            <SettingSection
              key={section.title}
              title={section.title}
              icon={section.icon}
              items={section.items}
              onItemPress={handleItemPress}
            />
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SettingsScreen;
