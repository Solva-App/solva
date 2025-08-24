import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

/** -------------------------------
 * API CONFIG
 * ------------------------------- */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://solva-backend-prod.onrender.com/api/v1";

interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/** -------------------------------
 * STATE FOR REFRESH HANDLING
 * ------------------------------- */
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

/** -------------------------------
 * REFRESH TOKEN FUNCTION
 * ------------------------------- */
const refreshToken = async (): Promise<string> => {
  const token = Cookies.get("refreshToken");
  if (!token) throw new Error("No refresh token available");

  console.log("[Token Refresh] Starting refresh...");

  const response = await axios.post(`${API_BASE_URL}/users/admin/generate/token`, {
    refreshToken: token,
  });

  const { accessToken, refreshToken: newRefresh } = response.data.tokens;

  console.log("[Token Refresh] New Access Token:", accessToken);

  // Store new tokens
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

/** -------------------------------
 * CREATE AXIOS INSTANCE
 * ------------------------------- */
export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /** -------------------------------
   * REQUEST INTERCEPTOR
   * ------------------------------- */
  instance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /** -------------------------------
   * RESPONSE INTERCEPTOR
   * ------------------------------- */
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || "Unexpected error occurred";

        // Handle 401: Token expired
        if (status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((newToken) => {
                console.log("[Retry Queue] Retrying request with token:", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshToken();
            processQueue(null, newToken);

            console.log("[Retry Request] Using refreshed token...");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);

            // Clear cookies
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            // Force logout (non-React context)
            if (typeof window !== "undefined") {
              toast.error("Session expired. Please log in again.");
              window.location.href = "/";
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        /** -------------------------------
         * ERROR HANDLING FOR OTHER STATUS CODES
         * ------------------------------- */
        switch (status) {
          case 400:
            toast.error(`Bad Request: ${message}`);
            break;
          case 403:
            toast.error("Forbidden: Not enough permission");
            break;
          case 404:
            toast.error(`Not Found: ${message}`);
            break;
          case 429:
            toast.error("Too Many Requests");
            break;
          case 500:
            toast.error(`Server Error: ${message}`);
            break;
          case 503:
            toast.error("Service Unavailable");
            break;
          default:
            toast.error(`Unexpected Error: ${status} ${message}`);
        }
      } else if (error.request) {
        // No response received
        toast.error(`No response from server: ${error.message}`);
      } else {
        // Axios setup/config error
        toast.error(`Axios setup error: ${error.message}`);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/** Exported singleton instance */
export const axiosInstance = createAxiosInstance();
