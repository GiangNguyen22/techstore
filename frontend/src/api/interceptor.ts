import axios, { AxiosInstance } from "axios";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
} from "../utils/auth.util";
import { getAccessTokenFromRefreshToken } from "./auth";

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLS();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log(token);
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.headers?.Authorization
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshTokenFromLS();
        if (!refreshToken) throw new Error("Refresh token is missing.");

        const response = await getAccessTokenFromRefreshToken(refreshToken);
        const newAccessToken = response?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } else {
          clearLS();
          return Promise.reject("Failed to refresh access token.");
        }
      } catch (err) {
        clearLS();
        console.error("Error refreshing access token:", err);
        return Promise.reject(err);
      }
    }

    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default instance;
