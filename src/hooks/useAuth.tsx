import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext({
  isAuthenticated: false, 
  user: {},
  login: (data:any) => {},
  logout: () => {}
})

type contextProps = {
  children?: ReactNode,
}

export const AuthProvider = (props: contextProps) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!user ? true : false);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data:any) => {
    setUser(data);
    setIsAuthenticated(true);
    navigate("/home");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};