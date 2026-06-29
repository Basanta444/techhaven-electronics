// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjDU72qCZuuu5rGQlgKHlxIUvdqWg8CY4",
  authDomain: "techhaven-electronics-3d0c6.firebaseapp.com",
  projectId: "techhaven-electronics-3d0c6",
  storageBucket: "techhaven-electronics-3d0c6.firebasestorage.app",
  messagingSenderId: "930469654853",
  appId: "1:930469654853:web:500024bb591ba035088e2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services for use in other files
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();