
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
    baseURL: BASE_URL,
});

const refreshClient = axios.create({
    baseURL: BASE_URL,
});

let refreshPromise = null;

// Attach the latest access token to every API request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh an expired access token and retry the original request.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            !originalRequest ||
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        const url = originalRequest.url || "";

        // Do not refresh login or refresh requests.
        if (
            url.includes("auth/login/") ||
            url.includes("token/refresh/")
        ) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            clearAuthentication();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post("token/refresh/", {
                        refresh: refreshToken,
                    })
                    .then((response) => {
                        const { access, refresh } = response.data;

                        localStorage.setItem("accessToken", access);

                        if (refresh) {
                            localStorage.setItem("refreshToken", refresh);
                        }

                        window.dispatchEvent(
                            new CustomEvent("auth:token-refreshed", {
                                detail: {
                                    accessToken: access,
                                },
                            })
                        );

                        return access;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers = originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            clearAuthentication();
            return Promise.reject(refreshError);
        }
    }
);

function clearAuthentication() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth:logout"));
}

export default api;
