import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface AppState {
  auth: AuthState;
}

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
}

interface AuthTokens {
  access: string;
  refresh?: string; // Optional refresh token
}

interface AuthPayload {
  brand: any; // Adjust this type based on actual structure (e.g., `string` or an object)
  tokens: AuthTokens;
}

// Ensure localStorage is accessed only on the client
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const token = getToken();

const initialState: AuthState = {
  isAuthenticated: !!token,
  user: null,
  token: token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload?.brand;
      state.token = action.payload?.tokens?.access;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload?.tokens?.access);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export const useAuth = () => useSelector((state: AppState) => state.auth);
export default authSlice.reducer;
