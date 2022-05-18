// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgQF-lHiEKtCFwJn2wyH7vljSE_eSxxaQ",
  authDomain: "projectnews-6193f.firebaseapp.com",
  projectId: "projectnews-6193f",
  storageBucket: "projectnews-6193f.appspot.com",
  messagingSenderId: "669953938184",
  appId: "1:669953938184:web:d787363ca5db2f3a12d2bd",
  measurementId: "G-9625WVHWHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);