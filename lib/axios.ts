import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await axios.post(
    "https://solva-backend-prod.onrender.com/api/v1/users/admin/generate/token",
    { refreshToken }
  );

  const { accessToken, refreshToken: newRefresh } = response.data;

  Cookies.set("accessToken", accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  if (newRefresh) {
    Cookies.set("refreshToken", newRefresh, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return accessToken;
};

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: "https://solva-backend-prod.onrender.com/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(config => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "";

      if (status === 401 && message.toLowerCase().includes("expired") && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);

          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          if (typeof window !== "undefined") {
            toast.error("Session expired. Please log in again.");
            window.location.href = "/";
          }

          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
