import { useEffect, useState, useRef } from "react";

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  runTransaction,
} from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

import Canvas from "./components/Canvas";

// firebase
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

const app = initializeApp(firebaseConfig);
const db = getDatabase();

export default function App() {
  function getHeightWidth() {
    return [window.innerHeight, window.innerWidth];
  }
  const canvasRef = useRef(null);
  const [heightWidth, setHeightWidth] = useState(getHeightWidth());
  const [playerRef, setPlayerRef] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth).then(() => {
      console.log("logged in");
    });
    onAuthStateChanged(auth, (player) => {
      console.log(player);
      setPlayerId(player.uid);
      const reference = ref(db, "players/" + player.uid);
      window.addEventListener("resize", () => setHeightWidth(getHeightWidth));
      window.addEventListener("keydown", (e) => {
        const pressedKey = e.key.toLowerCase();
        if (pressedKey === "w") {
          runTransaction(reference, (prevData) => {
            const newPos = prevData.pos;
            newPos[1]--;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "s") {
          runTransaction(reference, (prevData) => {
            const newPos = prevData.pos;
            newPos[1]++;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "a") {
          runTransaction(reference, (prevData) => {
            const newPos = prevData.pos;
            newPos[0]--;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "d") {
          runTransaction(reference, (prevData) => {
            const newPos = prevData.pos;
            newPos[0]++;
            return { ...prevData, pos: newPos };
          });
        }
      });
      setPlayerRef(reference);
      set(reference, {
        pos: [0, 0, 50, 50],
      });
      onValue(reference, (snapshot) => {
        const data = snapshot.val();
        setPos(data.pos);
      });
    });
  }, []);

  const [pos, setPos] = useState(0);
  const draw = (context) => {
    context.clearRect(0, 0, heightWidth[0], heightWidth[1]);
    context.fillStyle = "rgb(200, 0, 0)";
    context.fillRect(pos[0], pos[1], pos[2], pos[3]);

    context.fillStyle = "rgba(0, 0, 200, 0.5)";
    context.fillRect(50, 50, 50, 50);
  };

  if (!playerId) return <h1>Loading</h1>;
  return (
    <Canvas
      draw={draw}
      height={heightWidth[0]}
      width={heightWidth[1]}
      canvasRef={canvasRef}
    />
  );
}
