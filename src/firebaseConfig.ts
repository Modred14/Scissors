// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtsatdP2HsWD9RGLq3Wq4YYgHvBb5i_38",
  authDomain: "scissors-altschool-favour.firebaseapp.com",
  projectId: "scissors-altschool-favour",
  storageBucket: "scissors-altschool-favour.appspot.com",
  messagingSenderId: "835699170419",
  appId: "1:835699170419:web:311a46f8ff8be81faf1e06",
  measurementId: "G-GWHKGFRPNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };