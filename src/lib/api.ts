import axios, { type InternalAxiosRequestConfig, type AxiosHeaders } from "axios";
import { useIdempotencyStore } from "./store/idempotencyDataStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const idempotencyKey = useIdempotencyStore.getState().getIdempotencyKey();
  const key = import.meta.env.VITE_API_KEY;

  if (config.headers) {
    const h = config.headers as AxiosHeaders | Record<string, string>;
    (h as AxiosHeaders).set?.("Idempotency-Key", idempotencyKey);
    (h as AxiosHeaders).set?.("API-KEY", key);
  }
  return config;
});
