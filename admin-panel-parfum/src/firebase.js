// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCg8hu-oD7tnmkExfm_1SPvT2zndFkMFDI",
  authDomain: "parfum-arex.firebaseapp.com",
  projectId: "parfum-arex",
  storageBucket: "parfum-arex.firebasestorage.app",
  messagingSenderId: "177304289440",
  appId: "1:177304289440:android:c54e50dbcb94b3dc1809c5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
