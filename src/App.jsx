import './App.css'
import { useEffect } from 'react';

// firebase 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, signInAnonymously} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp5w61IkIJyCWwdbnyaFgutH2h7OQA0kY",
  authDomain: "reactjamoct23.firebaseapp.com",
  projectId: "reactjamoct23",
  storageBucket: "reactjamoct23.appspot.com",
  messagingSenderId: "588846959907",
  appId: "1:588846959907:web:adce07aade0f3de3a91096",
  measurementId: "G-TV6DWL46HJ"
};

// Initialize Firebase


function App() {
  useEffect(()=>{
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    signInAnonymously(auth).then(()=>{
      console.log("signed in");
    })
  },[])
  return (
    <>
      <h1>test</h1>
    </>
  )
}

export default App
