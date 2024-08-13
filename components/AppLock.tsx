import { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const AppLock = ({ onUnlock }: { onUnlock: () => void }) => {
  const [useBio, setUseBio] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const savedUseBio = await SecureStore.getItemAsync('useBio');
        const savedPin = await SecureStore.getItemAsync('pin');
        if (savedUseBio !== null) setUseBio(JSON.parse(savedUseBio));
        if (savedPin !== null) setPin(savedPin);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    checkSettings();
  }, []);

  const handleUnlock = async () => {
    if (useBio) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to unlock',
      });

      if (result.success) {
        onUnlock();
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } else {
      // Prompt for PIN entry
      // Here, you would show a PIN entry UI and validate it
      // This is a simplified example
      const enteredPin = 'user-entered-pin'; // Replace with actual PIN input from user
      if (enteredPin === pin) {
        onUnlock();
      } else {
        Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
      }
    }
  };

  return (
    <View>
      <Text>Please authenticate to access the app:</Text>
      <Button title="Unlock" onPress={handleUnlock} />
    </View>
  );
};

export default AppLock;
