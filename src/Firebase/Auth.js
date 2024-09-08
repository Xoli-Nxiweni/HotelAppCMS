// src/services/auth.js
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Import the Firebase auth instance

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Sign out
export const signOutUser = () => {
  return signOut(auth);
};

// Export the Google Auth Provider
export { googleProvider };
