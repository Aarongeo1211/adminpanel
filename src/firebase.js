import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBm1BgRc04zSa0KOxKV4uZsc_6NXAYCQN4",
  authDomain: "fitnesswithvikram-1cdab.firebaseapp.com",
  projectId: "fitnesswithvikram-1cdab",
  storageBucket: "fitnesswithvikram-1cdab.appspot.com",
  messagingSenderId: "88765624937",
  appId: "1:88765624937:web:454454793b205b1ac868f8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage }; 