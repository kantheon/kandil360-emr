import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFH7UeJC_Zb2rhWvNCR1I8gIOAm_Ia6G8",
  authDomain: "emrsystem-2bf96.firebaseapp.com",
  projectId: "emrsystem-2bf96",
  storageBucket: "emrsystem-2bf96.firebasestorage.app",
  messagingSenderId: "739854576411",
  appId: "1:739854576411:web:de765ee2013f41a0fac1be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
