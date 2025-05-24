// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR0JS_LPshKCqpkl2oadWg_D1MyjQHly4",
  authDomain: "career-ai-6692b.firebaseapp.com",
  projectId: "career-ai-6692b",
  storageBucket: "career-ai-6692b.firebasestorage.app",
  messagingSenderId: "842268681028",
  appId: "1:842268681028:web:05b0942bb7c5a494786d11",
  measurementId: "G-WWY4X1C6H5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);