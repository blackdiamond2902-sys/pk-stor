import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJUXIb7EJbEg-vMheyyGrIzbZZGhUMJQc",
  authDomain: "pk-stor.firebaseapp.com",
  projectId: "pk-stor",
  storageBucket: "pk-stor.firebasestorage.app",
  messagingSenderId: "647577560621",
  appId: "1:647577560621:web:669895224f70ab50fc7aa4",
  measurementId: "G-D2WNYX4G1N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Login Error:", error);
  }
};

export const logoutUser = () => signOut(auth);