// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCfoKYRrKA2qRtnPRgkeYirHVbqPwPZvDk",
  authDomain: "abeia-cc22d.firebaseapp.com",
  projectId: "abeia-cc22d",
  storageBucket: "abeia-cc22d.firebasestorage.app",
  messagingSenderId: "362744264790",
  appId: "1:362744264790:web:d2a94c314110235adb63f7",
  measurementId: "G-MR7VX468GJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// EXPORTAÇÃO OBRIGATÓRIA DA AUTENTICAÇÃO:
export const auth = getAuth(app);
export const db = getDatabase(app)