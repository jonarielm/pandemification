// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/performance";
import "firebase/compat/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPXySj3Tp3Oggvf8dVg1i-s32nJCv8FF0",
  authDomain: "pandemification-adnu.firebaseapp.com",
  projectId: "pandemification-adnu",
  storageBucket: "pandemification-adnu.appspot.com",
  messagingSenderId: "49473779995",
  appId: "1:49473779995:web:670a8a6fc6c0ef38c13bbe",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const perf = firebase.performance();
const analytics = firebase.analytics();

export default firebase;
