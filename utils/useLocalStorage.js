import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState();

  const setValue = (value) => {
    window.localStorage.setItem(key, value);
  };

  useEffect(() => {
    const value = window.localStorage.getItem(key);

    if (value) {
      try {
        setStoredValue(value);
      } catch (error) {
        console.log(error);
        setStoredValue(initialValue);
      }
    } else {
      setStoredValue(initialValue);
    }
  }, []);

  useEffect(() => {
    if (storedValue) {
      setValue(storedValue);
    }
  }, [storedValue]);

  return [storedValue, setStoredValue];
};