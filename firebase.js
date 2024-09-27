import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDixDVkH-wh1sU8vyq0m3gD5ehWzDCNVzI",
  authDomain: "femihub-7047b.firebaseapp.com",
  projectId: "femihub-7047b",
  storageBucket: "femihub-7047b.appspot.com",
  messagingSenderId: "450652021008",
  appId: "1:450652021008:web:611140fa405497f3344595",
  measurementId: "G-311BTT1YZK"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { app, auth };
