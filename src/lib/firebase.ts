import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCADGVtgprtvb6kPGBkmT8OI0rIabNH7t0",
  authDomain: "fika-2025.firebaseapp.com",
  databaseURL: "https://fika-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fika-2025",
  storageBucket: "fika-2025.firebasestorage.app",
  messagingSenderId: "96159729075",
  appId: "1:96159729075:web:2609291881beb2a27ab7c6",
  measurementId: "G-4V1C9XMNDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;