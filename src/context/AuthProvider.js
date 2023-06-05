import { createContext, useEffect, useState } from "react";
import { getUserById } from "../api/API";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [rememberMe, setRememberMe] = useState(true);
  // user
  const [user, setUser] = useState(null);
  const userID =
    rememberMe || !!localStorage.getItem("userID")
      ? localStorage.getItem("userID")
      : sessionStorage.getItem("userID");

  const fetchUser = async () => {
    try {
      if (userID === null) {
        setUser(null);
      } else {
        const response = await getUserById(userID);
        if (response.status === 200) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // logout function
  function logout() {
    sessionStorage.clear();
    setRememberMe(false);
    sessionStorage.removeItem("userID");
    localStorage.removeItem("userID");
    setUser(null);
  }

  // check if user is logged in
  const isLoggedIn = () => {
    // return !!sessionStorage.getItem("userId");
    return !!userID;
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        isLoggedIn,
        user,
        setUser,
        userID,
        rememberMe,
        setRememberMe,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;