import axios, { type AxiosHeaders, AxiosInstance } from "axios";
import { useIdempotencyStore } from "./store/idempotencyDataStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout : parseInt(import.meta.env.VITE_API_TIMEOUT ?? "30000")
})

const attachInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use((config) => {
    const idempotencyKey = useIdempotencyStore.getState().getIdempotencyKey()
    const key = import.meta.env.VITE_API_KEY

    if (config.headers) {
      const h = config.headers as AxiosHeaders | Record<string, string>;
      (h as AxiosHeaders).set?.("Idempotency-Key", idempotencyKey);
      (h as AxiosHeaders).set?.("X-API-KEY", key);
    }
    return config;
  })
}

attachInterceptors(api)
