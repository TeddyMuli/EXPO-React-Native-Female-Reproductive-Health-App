import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ToastProvider } from 'react-native-toast-notifications'
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from './context/AuthContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./globals.css"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient()
  //const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // amiri:require('../assets/fonts/Amiri-Bold.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="splashScreen3" options={{ headerShown: false }} />
            <Stack.Screen name="splashScreen4" options={{ headerShown: false }} />
            <Stack.Screen name="splashScreen5" options={{ headerShown: false }} />
            <Stack.Screen name="splashScreen6" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="forgotPassword" options={{ headerTitle: 'Forgot Password', headerTintColor: 'black', headerBackButtonMenuEnabled: false, headerBackVisible: false, headerTitleAlign: 'center', headerStyle: { backgroundColor: '#E4258F' } }} />
            <Stack.Screen name="handleEmailLink"  options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name='verifycode' options={{ headerShown: false }} />
            <Stack.Screen
              name='premium'
              options={{
                headerTitle: 'Premium Features',
                headerTitleAlign: 'center',
                headerTintColor: '#FFB22C',
                headerStyle: {
                  backgroundColor: 'black',
                },
              }}
            />
            <Stack.Screen
              name='settings'
              options={{
                headerTitle: 'Settings',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 16 }}
                  />
                ),
              }}
            />
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}