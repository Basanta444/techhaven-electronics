// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhOZnL3BY3X1AuBiIFKKnxUDRn6rKH4qk",
  authDomain: "techhaven-electronics.firebaseapp.com",
  projectId: "techhaven-electronics",
  storageBucket: "techhaven-electronics.firebasestorage.app",
  messagingSenderId: "442707930185",
  appId: "1:442707930185:web:ce48d3885520cf5e21e398",
  measurementId: "G-JH4T3NCPE7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export Database and Authentication so other files can use them
export const db = getFirestore(app);
export const auth = getAuth(app);