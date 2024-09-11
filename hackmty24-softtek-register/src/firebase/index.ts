// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5EqBo5wOAAtFsNt-hmj1SN7ayDgy8V3I",
  authDomain: "hackmty24-signup.firebaseapp.com",
  projectId: "hackmty24-signup",
  storageBucket: "hackmty24-signup.appspot.com",
  messagingSenderId: "259695399230",
  appId: "1:259695399230:web:2d3e75150f1f9593525c6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const fs = getFirestore();

export { app, auth, fs }