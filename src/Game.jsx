import { useEffect, useState, useRef } from "react";

import {
  getDatabase,
  ref,
  set,
  onValue,
  runTransaction,
  onDisconnect,
  remove,
} from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

import Canvas from "./components/Canvas";

// firebase

function getHeightWidth() {
  return [window.innerHeight, window.innerWidth];
}

export default function Game({ db, currentSession }) {
  const canvasRef = useRef(null);
  const [heightWidth, setHeightWidth] = useState(getHeightWidth());
  const [playerRef, setPlayerRef] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerPositions, setPlayerPositions] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth).then(() => {
      console.log("logged in");
    });
    onAuthStateChanged(auth, (player) => {
      console.log(player);
      setPlayerId(player.uid);
      const playerRef = ref(db, currentSession + "/players/" + player.uid);
      const allPlayers = ref(db, currentSession + "/players/");
      window.addEventListener("resize", () => setHeightWidth(getHeightWidth));
      window.addEventListener("keydown", (e) => {
        const pressedKey = e.key.toLowerCase();
        if (pressedKey === "w") {
          runTransaction(playerRef, (prevData) => {
            const newPos = prevData.pos;
            newPos[1]--;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "s") {
          runTransaction(playerRef, (prevData) => {
            const newPos = prevData.pos;
            newPos[1]++;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "a") {
          runTransaction(playerRef, (prevData) => {
            const newPos = prevData.pos;
            newPos[0]--;
            return { ...prevData, pos: newPos };
          });
        }
        if (pressedKey === "d") {
          runTransaction(playerRef, (prevData) => {
            const newPos = prevData.pos;
            newPos[0]++;
            return { ...prevData, pos: newPos };
          });
        }
      });

      setPlayerRef(playerRef);
      set(playerRef, {
        pos: [0, 0, 50, 50],
      });
      onValue(playerRef, (snapshot) => {
        const data = snapshot.val();
        setPos(data.pos);
      });
      onValue(allPlayers, (snapshot) => {
        const data = snapshot.val();
        const positions = Object.keys(data).map((playerKey) => {
          return data[playerKey].pos;
        });
        setPlayerPositions(positions);
      });
      // onDisconnect(playerRef).remove(playerRef);
    });
  }, []);

  const [pos, setPos] = useState(0);
  const draw = (context) => {
    context.clearRect(0, 0, heightWidth[0], heightWidth[1]);
    playerPositions?.forEach((pos) => {
      context.fillStyle = "rgb(200, 0, 0)";
      context.fillRect(pos[0], pos[1], pos[2], pos[3]);
    });
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
