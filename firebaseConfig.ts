// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBtag7WE7co6ETI6zG1TZd5GiJaQTXog_E",
	authDomain: "what-are-the-words.firebaseapp.com",
	projectId: "what-are-the-words",
	storageBucket: "what-are-the-words.firebasestorage.app",
	messagingSenderId: "1016485248700",
	appId: "1:1016485248700:web:8d22ce635798fd2de9dab9",
	measurementId: "G-0TZEW3G2MD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});
