import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../Config/Firebase";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartService, setCartService] = useState({
    totalAmount: 0,
    services:[]
})
  useEffect(() => {
    function checkSession() {
      const userFromStorage = JSON.parse(localStorage.getItem("userData"));
      if (userFromStorage) {
        setUser(userFromStorage);
      }
    }
    checkSession();
  }, []);
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setCartService,
        cartService,
        googleSignIn
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function UseUser() {
  return useContext(UserContext);
}
