import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmrl-3uJLKhe33N8J0lSg-4FM_OsE6UW0",
  authDomain: "makaan-b398e.firebaseapp.com",
  projectId: "makaan-b398e",
  storageBucket: "makaan-b398e.firebasestorage.app",
  messagingSenderId: "92428535510",
  appId: "1:92428535510:web:b14454b968ea4543182b77",
  measurementId: "G-FLPK64EZV8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
