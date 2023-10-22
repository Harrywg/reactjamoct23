import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import Menu from "./components/Menu";
const firebaseConfig = {
  apiKey: "AIzaSyCp5w61IkIJyCWwdbnyaFgutH2h7OQA0kY",
  authDomain: "reactjamoct23.firebaseapp.com",
  projectId: "reactjamoct23",
  storageBucket: "reactjamoct23.appspot.com",
  messagingSenderId: "588846959907",
  appId: "1:588846959907:web:adce07aade0f3de3a91096",
  measurementId: "G-TV6DWL46HJ",
  databaseURL:
    "https://reactjamoct23-default-rtdb.europe-west1.firebasedatabase.app",
};

import Game from "./Game";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

const url = window.location.href;
const urlSession = url.split("/").at(-1);

export default function App() {
  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
    const sessionRef = ref(db, "/" + urlSession);
    onValue(sessionRef, (snapshot) => {
      if (snapshot.val()) setCurrentSession(urlSession);
    });
  }, []);
  if (currentSession) return <Game db={db} currentSession={currentSession} />;
  else return <Menu db={db} />;
}
