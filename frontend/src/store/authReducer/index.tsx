import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api";
import localStorage from "redux-persist/es/storage";

const getTokenFromLocalStorage = async () => {
  const data = await localStorage.getItem("auth");
  if (data) {
    return JSON.parse(data).user;
  } else {
    return null;
  }
};

const userInf = getTokenFromLocalStorage();

interface AuthState {
    isLoading: boolean;
    doneForgot: boolean;
    userInfo: any;
    error: any;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  doneForgot: false,
  userInfo: userInf,
  error: {},
  isAuthenticated: false,
};

export const login = createAsyncThunk("auth/login", async (body, thunkApi) => {
  try {
    const result = await axios.post("/");
    return result.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getRefreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (data, thunkApi) => {
    try {
      const result = await axios.get("/auth/token", {
        withCredentials: true,
      });
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const authSlide = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetError: (state) => {
      return {
        ...state,
        error: {}
      };
    },
    logOut: (state) => {
      return {
        ...state,
        isAuthenticated: false,
        userInfo: {},
      };
    },
    setUserInfo: (state, action) => {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("auth", JSON.stringify(action.payload));
      return {
        ...state,
        userInfo: action.payload.user,
        isLoading: false,
        isAuthenticated: true,
      };
    });
    builder.addCase(login.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        userInfo: null,
        error: action.payload,
        isAuthenticated: false,
      };
    });
    // Refresh Token
    builder.addCase(getRefreshToken.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(getRefreshToken.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        userInfo: action.payload.user,
        isAuthenticated: true,
      };
    });
    builder.addCase(getRefreshToken.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };
    });
  }
});

export const {
  resetError,
  logOut,
  setUserInfo,
} = authSlide.actions;

export default authSlide.reducer;