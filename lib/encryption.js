import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key-2023"; // In production, use environment variable
const SALT = "QuickCart"; // Optional salt for additional security

export const encryptData = (data) => {
  try {
    // Convert data to string if it's an object
    const stringToEncrypt =
      typeof data === "object" ? JSON.stringify(data) : String(data);

    // Create key and IV
    const key = CryptoJS.PBKDF2(SECRET_KEY, SALT, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    // Encrypt
    const encrypted = CryptoJS.AES.encrypt(stringToEncrypt, key.toString());
    return encrypted.toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptData = (encryptedString) => {
  try {
    if (!encryptedString) {
      return null;
    }

    // Recreate key
    const key = CryptoJS.PBKDF2(SECRET_KEY, SALT, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encryptedString, key.toString());
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // Try parsing as JSON, return as is if not JSON
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
