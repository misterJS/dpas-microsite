import axios, { type InternalAxiosRequestConfig, type AxiosHeaders } from "axios";
import { v4 as uuidv4 } from "uuid";

function getIdempotencyKey() {
  let key = sessionStorage.getItem("idempotencyKey");
  if (!key) {
    key = uuidv4();
    sessionStorage.setItem("idempotencyKey", key);
  }
  return key;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const idempotencyKey = getIdempotencyKey();
  const key = import.meta.env.VITE_API_KEY;

  if (config.headers) {
    const h = config.headers as AxiosHeaders | Record<string, string>;
    (h as AxiosHeaders).set?.("Idempotency-Key", idempotencyKey);
    (h as AxiosHeaders).set?.("API-KEY", key);
  }
  return config;
});
