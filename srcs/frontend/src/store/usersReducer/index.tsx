import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../api";

interface UsersState {
  users: [];
  user: any;
  matchHistory: [];
  isLoading: boolean;
  error: any;
}

const initialState: UsersState = {
  users: [],
  user: {},
  matchHistory: [],
  isLoading: false,
  error: {},
};

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, thunkApi) => {
    try {
      const result = await axiosPrivate.get(`/users/${id}`);
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchMatchHistory = createAsyncThunk(
  "users/fetchMatchHistory",
  async (id: string, thunkApi) => {
    try {
      const result = await axiosPrivate.get(`/game/history/${id}`);
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (data, thunkApi) => {
    try {
      const result = await axiosPrivate.get("/users");
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const usersSlide = createSlice({
  name: "Users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    });
    builder.addCase(fetchMatchHistory.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(fetchMatchHistory.fulfilled, (state, action) => {
      return {
        ...state,
        matchHistory: action.payload,
        isLoading: false,
      };
    });
    builder.addCase(fetchMatchHistory.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    });
    builder.addCase(fetchAllUsers.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        userInfo: action.payload,
      };
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    });
  },
});

export default usersSlide.reducer;
