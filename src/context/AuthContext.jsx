import { createContext, useContext, useReducer, useCallback } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = useCallback(async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    dispatch({ type: "login", payload: decoded });
  }, []);

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");
  return context;
}

export { AuthProvider, useAuth };