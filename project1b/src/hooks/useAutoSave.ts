import { useEffect, useRef } from 'react';
import type { LoanFormData } from '@/lib/loanForm';

const STORAGE_KEY = 'lendswift-application-v1';
const SALT = 'lendSwiftAutoSaveSalt';
const PASS = 'secure-lendswift-storage';

function encodeBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getCryptoKey() {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(PASS), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(SALT),
      iterations: 120000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptValue(value: string) {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return JSON.stringify({ iv: encodeBase64(iv.buffer), data: encodeBase64(encrypted) });
}

async function decryptValue(ciphertext: string) {
  const key = await getCryptoKey();
  const payload = JSON.parse(ciphertext) as { iv: string; data: string };
  const iv = new Uint8Array(decodeBase64(payload.iv));
  const data = decodeBase64(payload.data);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

export function useAutoSave(formData: LoanFormData, enabled: boolean, onRestore: (data: LoanFormData) => void) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const save = async () => {
      try {
        const encrypted = await encryptValue(JSON.stringify(formData));
        window.localStorage.setItem(STORAGE_KEY, encrypted);
      } catch {
        // silent fail to avoid blocking the UI
      }
    };

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(save, 300);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [enabled, formData]);

  useEffect(() => {
    if (!enabled) return;

    const restore = async () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      try {
        const decrypted = await decryptValue(saved);
        onRestore(JSON.parse(decrypted));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    };

    restore();
  }, [enabled, onRestore]);
}
