import CONFIG from "@/configs/config";
import ROUTE_PATHS from "@/routes/route-paths";
import CommonUtils from "@/utils/common.utils";
import { addToast } from "@heroui/react";
import axios from "axios";

const http = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 90000, // 90 seconds
});

http.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: any) => response?.data,
  async (error: any) => {
    const isAuthPage = window.location.pathname.includes(
      ROUTE_PATHS.AUTH.LOGIN,
    );

    if (
      !isAuthPage &&
      (error.response?.status === 401 || error?.response?.statusCode === 401)
    ) {
      CommonUtils.logout();
    }

    // Callers can opt out of the global error toast (e.g. a probe request
    // where a 4xx is an expected, non-error outcome) via config.skipErrorToast.
    if (!error?.config?.skipErrorToast) {
      addToast({
        title: "Oops!",
        color: "danger",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }

    return Promise.reject(error?.response?.data);
  },
);

export default http;
