import axios from "axios";
import authService from "./authService";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config: any) => {
    const refreshEndpoints = ["/auth/logout", "/auth/refresh"]; // URLs where refresh token should be used instead of access token

    const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      // If the request is to a refresh or logout endpoint, use the refresh token, otherwise use the access token
      const token = refreshEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      )
        ? refreshToken
        : accessToken;

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor that refreshes the access token if it's expired
api.interceptors.response.use(
  (response) => response, // Return the response itself if it's successful
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops
      try {
        const response = await authService.refresh();
        const { refreshToken, accessToken } = response.data!;

        localStorage.setItem(
          "tokens",
          JSON.stringify({ accessToken, refreshToken })
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest); // After the refresh, re-run the original request
      } catch (_error) {
        // If the refresh token is expired, log the user out
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");

        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
