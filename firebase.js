import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-FRxKu0Lcl7ZOpZbOAVj2lSbq-_V-5Dg",
  authDomain: "femihub-e7f9a.firebaseapp.com",
  projectId: "femihub-e7f9a",
  storageBucket: "femihub-e7f9a.appspot.com",
  messagingSenderId: "253516920814",
  appId: "1:253516920814:web:301bb995b517c9146080ff",
  measurementId: "G-G8HWHQREGH"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { app, auth };
