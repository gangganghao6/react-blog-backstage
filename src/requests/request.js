import axios from "axios";

export const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    config.headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
