// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0MiDYGMlZiEtc7OUFjua7w5xwtYUq9D0",
  authDomain: "image-of-e-commerce-mern.firebaseapp.com",
  projectId: "image-of-e-commerce-mern",
  storageBucket: "image-of-e-commerce-mern.appspot.com",
  messagingSenderId: "821029066307",
  appId: "1:821029066307:web:b0f6b3ca659e1293ed26f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
