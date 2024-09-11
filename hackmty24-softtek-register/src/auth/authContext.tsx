"use client"
import { auth } from "@/firebase";
import { onAuthStateChanged, UserCredential, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: boolean };

type AuthState = {
  user: User | UserCredential | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "CLEAR_USER":
      return { ...state, user: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  authState: initialState,
  dispatch: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate()


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("auth changed", user);
      dispatch({ type: "SET_USER", payload: user });
      if (!user) {
        navigate('/'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };