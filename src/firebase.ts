// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCApO0dREWPtUhjnZO3jWwij2CFVBlfxu4",
  authDomain: "scissors-favour-altschool.firebaseapp.com",
  databaseURL: "https://scissors-favour-altschool-default-rtdb.firebaseio.com",
  projectId: "scissors-favour-altschool",
  storageBucket: "scissors-favour-altschool.appspot.com",
  messagingSenderId: "1054860049701",
  appId: "1:1054860049701:web:86ec6a33bf941a2fa72ecc",
  measurementId: "G-CZCWWY6GNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };