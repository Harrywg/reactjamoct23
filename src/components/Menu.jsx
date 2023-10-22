import { useState } from "react";
import { set, ref, onValue } from "firebase/database";
import { makeId } from "../utils";

export default function Menu({ db }) {
  const [menuState, setMenuState] = useState("home");
  const [codeInput, setCodeInput] = useState("");
  const [newSessionState, setNewSessionState] = useState("");
  if (menuState === "home")
    return (
      <main>
        <h1>Dracula in Space </h1>
        <button
          onClick={() => {
            const newCode = makeId(5);
            setNewSessionState(newCode);
            const newSession = ref(db, "/" + newCode);
            set(newSession, newCode);
            setMenuState("create");
          }}
        >
          Create a Lobby
        </button>
        <button
          onClick={() => {
            setMenuState("join");
          }}
        >
          Join a Lobby
        </button>
      </main>
    );

  if (menuState === "create")
    return (
      <main>
        <button onClick={() => setMenuState("home")}>Back</button>
        <h2>Here is your lobby code</h2>
        <p>{newSessionState}</p>
        <button
          onClick={() => {
            const domain = new URL(window.location.href);
            window.location.assign(
              window.location.protocol +
                "//" +
                domain.host +
                "/" +
                newSessionState
            );
          }}
        >
          Join lobby
        </button>
      </main>
    );

  if (menuState === "join")
    return (
      <main>
        <button onClick={() => setMenuState("home")}>Back</button>
        <h2>Enter lobby code</h2>
        <input
          type="text"
          value={codeInput}
          onChange={(e) => {
            console.log(codeInput);
            setCodeInput(e.target.value);
          }}
        />
        <button
          onClick={() => {
            const sessionRef = ref(db, "/" + codeInput);
            onValue(sessionRef, (snapshot) => {
              if (snapshot.val()) {
                const domain = new URL(window.location.href);
                window.location.assign(
                  window.location.protocol +
                    "//" +
                    domain.host +
                    "/" +
                    codeInput
                );
              } else {
                alert("This lobby does not exist :(");
              }
            });
          }}
        >
          Submit
        </button>
      </main>
    );

  if (menuState === "loading") return <h1>Loading...</h1>;
}
