
import axios, { AxiosInstance } from "axios";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
} from "../utils/auth.util";
import { getAccessTokenFromRefreshToken } from "./auth";

const instance: AxiosInstance = axios.create({
  baseURL: "http://192.168.119.146:8080/api",
  withCredentials: false,
  timeout: 15000,
  // headers: {
  //   "Content-Type": "application/json",
  // }
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLS();

    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Nếu không có token thì chắc chắn không gửi header Authorization
      if (config.headers && 'Authorization' in config.headers) {
        delete config.headers['Authorization'];
      }
    }

    // console.log("👉 Token gửi đi:", config.headers?.['Authorization'] || "Không có token");
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry lần nào
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshTokenFromLS();
        if (!refreshToken) throw new Error("Refresh token is missing.");

        const response = await getAccessTokenFromRefreshToken(refreshToken);
        const newAccessToken = response.accessToken;

        if (newAccessToken) {
          setAccessTokenToLS(newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } else {
          clearLS();
          return Promise.reject("Failed to refresh access token.");
        }
      } catch (err) {
        clearLS();
        // console.error("Error refreshing access token:", err);
        return Promise.reject(err);
      }
    }

    // Các lỗi khác trả về luôn
    return Promise.reject(error);
  }
);

export default instance;
