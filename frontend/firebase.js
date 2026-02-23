// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vingo-8d786.firebaseapp.com",
  projectId: "vingo-8d786",
  storageBucket: "vingo-8d786.firebasestorage.app",
  messagingSenderId: "663305804524",
  appId: "1:663305804524:web:ba3616764ecd9908a5e3c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { app, auth };
