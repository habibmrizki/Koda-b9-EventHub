import { useState, useEffect } from "react";

/**
 * @template S
 * @param {string} key
 * @param {S|null} initialValue
 * @returns {[S, import("react").Dispatch<import("react").SetStateAction<S>>]}
 */
function useLocalStorage(key, initialValue = null) {
  // state ? yes
  const [value, setValue] = useState(() => {
    // cek localstorage
    try {
      const data = localStorage.getItem(key);
      if (data !== null) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }

    // if not persisted yet, use initial value
    if (typeof initialValue === "function") {
      return initialValue();
    }
    return initialValue;
  });

  // apabila nilai berubah, update juga localstorage nya
  useEffect(() => {
    try {
      if (value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
