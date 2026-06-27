import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const logout = () => {
    sessionStorage.removeItem("user"); // remove the user from sessionStorage
    sessionStorage.removeItem("access_token"); // remove the JWT token
    dispatch({ type: "LOGOUT" }); // update the state to clear the user immediately
    axios.post("/auth/logout").catch((err) => {
      console.error("Backend logout clean failed:", err);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        logout, // add the logout function to the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
