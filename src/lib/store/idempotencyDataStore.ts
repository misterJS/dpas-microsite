// store/idempotencyStore.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createJSONStorage, persist } from "zustand/middleware";
import { encryptedSessionStorage } from "./encrypt-storage";

interface TActionIdempotency {
  idempotencyKey: string | null;
  getIdempotencyKey: () => string;
}

export const useIdempotencyStore = create<TActionIdempotency>()(
  persist((set, get) => ({
    idempotencyKey: '',
    getIdempotencyKey: () => {
        let key = get().idempotencyKey;
        if (!key) {
        key = uuidv4();
        sessionStorage.setItem("idempotencyKey", key);
        set({ idempotencyKey: key });
        }
        return key;
    }
  }),
  {
    name: "idempotencyKey",
    storage: createJSONStorage(() => encryptedSessionStorage)
  })
);