// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcXUg4t0dvHphOpA0xSzYw2j7hFP3fk_k",
  authDomain: "fyp25-ed434.firebaseapp.com",
  projectId: "fyp25-ed434",
  storageBucket: "fyp25-ed434.firebasestorage.app",
  messagingSenderId: "888684828483",
  appId: "1:888684828483:web:f50d0713e275315e3741f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
