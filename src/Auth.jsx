import { createContext } from "react";

export const UserContext = createContext();
const [userId, setUserId] = useState();
export function UserProvider({ children }) {
  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
}
