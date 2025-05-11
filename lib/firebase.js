// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

const firebaseConfig = {
  apiKey: "AIzaSyB_A9DD4xRl0P5Bpqv35_RryVm9u5PC-E4",
  authDomain: "smartcareercoach.firebaseapp.com", 
  projectId: "smartcareercoach",
  storageBucket: "smartcareercoach.appspot.com",
  messagingSenderId: "965409205436",
  appId: "1:965409205436:web:104052dd2e5ba0753274b9",
  measurementId: "G-ZR4544DDQ4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
