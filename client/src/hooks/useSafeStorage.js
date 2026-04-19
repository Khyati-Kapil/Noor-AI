import { useState, useCallback } from 'react';
import { safeGet, safeSet, safeStorage } from '../utils/safeStorage';

/**
 * React hook for using safeStorage with reactive state
 * 
 * @param {string} key - The storage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[value, setValue, remove]} [state, setState, removeState]
 * 
 * @example
 * const [token, setToken, removeToken] = useSafeStorage('token', '');
 * 
 * // Set value
 * setToken('my-token');
 * 
 * // Get value (can also use token directly)
 * console.log(token);
 * 
 * // Remove value
 * removeToken();
 */
export const useSafeStorage = (key, initialValue = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    return safeGet(key, initialValue);
  });

  // Return a wrapped version of the setter that persists to safeStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      safeSet(key, valueToStore);
    } catch (error) {
      console.warn(`useSafeStorage setValue failed for key '${key}':`, error.message);
    }
  }, [key, storedValue]);

  // Return a wrapped version of remove
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      safeStorage.removeItem(key);
    } catch (error) {
      console.warn(`useSafeStorage removeValue failed for key '${key}':`, error.message);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useSafeStorage;

