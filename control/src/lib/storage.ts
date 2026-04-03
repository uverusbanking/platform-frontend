export const customEncrypt = (value: string) => {
  let encryptedValue = btoa(value);
  for (let i = 0; i < 4; i++) {
    encryptedValue = btoa(encryptedValue);
  }

  return encryptedValue;
};

export const customDecrypt = (encrypted: string) => {
  let decryptedValue = atob(encrypted);
  for (let i = 0; i < 4; i++) {
    decryptedValue = atob(decryptedValue);
  }

  return decryptedValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setEncryptedLocalStorage(storageKey: string, value: any) {
  const stringValue = JSON.stringify(value);
  // localStorage.setItem(storageKey, customEncrypt(stringValue));

  const encryptedValue = btoa(stringValue);
  localStorage.setItem(storageKey, encryptedValue);
}

export function getDecryptedLocalStorage(storageKey: string) {
  const storedData = localStorage.getItem(storageKey) || "";
  // const storedValue = storedData ? JSON.parse(customDecrypt(storedData)) : null;

  const decryptedValue = atob(storedData);
  const storedValue =
    storedData && decryptedValue ? JSON.parse(decryptedValue) : null;
  return storedValue;
}

// THE FOLLOWING FUNCTIONS ARE USED FOR LOCAL STORAGE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorage(storageKey: string, value: any) {
  const lowLevelEncryption = btoa(JSON.stringify(value));
  localStorage.setItem(storageKey, lowLevelEncryption);
}

export function getLocalStorage(storageKey: string) {
  const storedData = localStorage.getItem(storageKey);
  const storedValue = storedData ? JSON.parse(atob(storedData)) : null;

  return storedValue;
}

export function removeLocalStorageItem(storageKey: string) {
  localStorage.removeItem(storageKey);
}

export function clearLocalStorage() {
  localStorage.clear();
}

// THE FOLLOWING FUNCTIONS ARE USED FOR SESSION STORAGE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setSessionStorage(storageKey: string, value: any) {
  const lowLevelEncryption = btoa(JSON.stringify(value));
  return sessionStorage.setItem(storageKey, lowLevelEncryption);
}

export function getSessionStorage(storageKey: string) {
  const storedData = sessionStorage.getItem(storageKey);
  const storedValue = storedData ? JSON.parse(atob(storedData)) : null;

  return storedValue;
}

export function removeSessionStorageItem(storageKey: string) {
  sessionStorage.removeItem(storageKey);
}

export function clearSessionStorage() {
  sessionStorage.clear();
}
