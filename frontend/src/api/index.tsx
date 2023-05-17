import axios from "axios";
import jwt_decode, { JwtPayload } from "jwt-decode";
import dayjs from "dayjs";
import localStorage from "redux-persist/es/storage";
import { router } from "../router";
import { logOut, setToken, setUserInfo } from "../store/authReducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";

let store = null;

export const injectStore = (storeParam: ToolkitStore) => {
  store = storeParam;
};

export const BASE_URL = process.env.REACT_APP_API_URL;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(async (req) => {
  const data = await localStorage.getItem("auth");
  if (data === null) {
    try {
      const response = await axios.get(`${BASE_URL}/token/`, {
        withCredentials: true,
      });
      localStorage.setItem("auth", JSON.stringify(response.data));
      store.dispatch(setUserInfo(response.data.user));
      store.dispatch(setToken(response.data.token));
      req.headers.Authorization = `Bearer ${response.data.token}`;
      return req;
    } catch (err) {
      try {
        await axios.get(`${BASE_URL}/logout`, {
          withCredentials: true,
        });
      } catch (err) {}
      store.dispatch(logOut());
      router.navigate("/login");
      return req;
    }
  }
  const parsedData = JSON.parse(data);
  const token = parsedData.token;
  const user = jwt_decode<JwtPayload>(token);
  const isExpired = dayjs.unix(user.exp!).diff(dayjs()) - 5000 < 1;
  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  }
  try {
    const response = await axios.get(`${BASE_URL}/token/`, {
      withCredentials: true,
    });
    localStorage.setItem("auth", JSON.stringify(response.data));
    store.dispatch(setUserInfo(response.data.user));
    store.dispatch(setToken(response.data.token));
    req.headers.Authorization = `Bearer ${response.data.token}`;
    return req;
  } catch (err) {
    try {
      await axios.get(`${BASE_URL}/logout`, {
        withCredentials: true,
      });
    } catch (err) {}
    localStorage.removeItem("auth");
    store.dispatch(logOut());
    router.navigate("/login");
    return req;
  }
});
