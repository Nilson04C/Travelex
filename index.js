// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6IuBVz7Uk4zGMH6iKZPioC9FFZuYwEhs",
  authDomain: "travelex-aedc8.firebaseapp.com",
  projectId: "travelex-aedc8",
  storageBucket: "travelex-aedc8.firebasestorage.app",
  messagingSenderId: "662096626912",
  appId: "1:662096626912:web:b6f780afa6591a0b7e3c85",
  measurementId: "G-J7CETLQHL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//console.log(app);