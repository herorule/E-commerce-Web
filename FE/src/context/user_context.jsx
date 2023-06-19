import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "./axios_instance.jsx";

const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [msg, setMsg] = useState("");

  const checklogin = useCallback(async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BE_URI}account/checklogin`
      );
      setIsLoggedIn(true)
      console.log('login rui');
    } catch (error) {
      console.log('chua log in');
    }
  }, []);

  const handleLogin = useCallback(async (n, p) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BE_URI}account/login`,
        {
          username: n,
          password: p,
        }
      );
      console.log(res);
      setMsg("Login successful");
      setIsLoggedIn(true)
    } catch (error) {
      if (error.response.data === "Missing username or password")
        setMsg("username or password is incorrect");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BE_URI}account/logout`
      );
      console.log(res);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  useEffect(() => {
    checklogin()
  }, [checklogin]);

  return (
    <UserContext.Provider
      value={{ msg, isLoggedIn, handleLogout, handleLogin }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => {
  return useContext(UserContext);
};
