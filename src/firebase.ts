// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmf_mejrKZrC4WVn6JLQMWXgPh1kNnaX8",
  authDomain: "leadzindb.firebaseapp.com",
  databaseURL: "https://leadzindb-default-rtdb.firebaseio.com",
  projectId: "leadzindb",
  storageBucket: "leadzindb.firebasestorage.app",
  messagingSenderId: "98290313064",
  appId: "1:98290313064:web:061704c8e06d77be5158dd",
  measurementId: "G-JR2B7THWCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);