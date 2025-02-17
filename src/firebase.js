// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiT0RTyvpMHfdXuEhzKkYe5sfuo_Ck1zQ",
  authDomain: "kitchen-management-syste-29385.firebaseapp.com",
  projectId: "kitchen-management-syste-29385",
  storageBucket: "kitchen-management-syste-29385.firebasestorage.app",
  messagingSenderId: "408153327203",
  appId: "1:408153327203:web:8872ce2108c50b22e71a56"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiT0RTyvpMHfdXuEhzKkYe5sfuo_Ck1zQ",
  authDomain: "kitchen-management-syste-29385.firebaseapp.com",
  projectId: "kitchen-management-syste-29385",
  storageBucket: "kitchen-management-syste-29385.firebasestorage.app",
  messagingSenderId: "408153327203",
  appId: "1:408153327203:web:8872ce2108c50b22e71a56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); */