import axios, { AxiosHeaders, AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { baseURL } from "./endpoints";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const refresh = Cookies.get("refreshToken");
  if (!refresh) throw new Error("No refresh token found");

  const response = await axios.post(`${baseURL}/users/admin/generate/token`, {
    refreshToken: refresh,
  });

  const { accessToken, refreshToken } = response.data.data;

  // ✅ set cookies globally
  Cookies.set("accessToken", accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // was /login
  });

  Cookies.set("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // was /login
  });

  return accessToken; // ✅ return only accessToken
};

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${baseURL}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: attach token
  instance.interceptors.request.use(
    (config) => {
      if (typeof window === "undefined") return config;

      const token = Cookies.get("accessToken");
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as any;
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "";

      if (
        status === 401 &&
        message.toLowerCase().includes("expired") &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers = new AxiosHeaders(
                originalRequest.headers
              );
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          processQueue(null, newToken);

          originalRequest.headers = new AxiosHeaders(originalRequest.headers);
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          return instance(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
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
