import { createContext, useEffect, useState } from "react";
import { getUserById } from "../api/API";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // user
  const [user, setUser] = useState(null);

  // set user from local storage if exists
  // id should change with token in production
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const fetchUser = async () => {
    try {
      const response = await getUserById(userId);
      setUser(response?.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  console.log("user: ", user);

  // logout function
  function logout() {
    setUser(null);
    localStorage.clear();
    setUserId(null);
  }

  // check if user is logged in
  const isLoggedIn = () => {
    // return !!localStorage.getItem("token");
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        isLoggedIn,
        user,
        fetchUser,
        setUser,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
