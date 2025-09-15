import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-super-secret-key';

// Encryption and decryption utilities
const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (ciphertext: any) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Custom storage object for Zustand persist middleware
export const encryptedLocalStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? decryptData(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, encryptData(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};