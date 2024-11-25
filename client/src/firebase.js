// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e25c3.firebaseapp.com",
  projectId: "mern-blog-e25c3",
  storageBucket: "mern-blog-e25c3.firebasestorage.app",
  messagingSenderId: "635028908946",
  appId: "1:635028908946:web:28ec17db01edca34302f4b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
