import axios, { type InternalAxiosRequestConfig, type AxiosHeaders } from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const key = import.meta.env.VITE_API_KEY;
    if (key) {
        const h = config.headers as AxiosHeaders | Record<string, string>;
        (h as AxiosHeaders).set?.("API-KEY", key);
        (h as Record<string, string>)["API-KEY"] = key;
    }
    return config;
});
