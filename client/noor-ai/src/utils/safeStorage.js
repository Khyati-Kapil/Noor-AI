/**
 * Safe Storage Utility - Handles sandboxed environments
 * 
 * Falls back to memory storage when sessionStorage/localStorage
 * are not available (e.g., origin = null, sandboxed iframes)
 */

const memoryStorage = new Map();

export const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
        return sessionStorage.getItem(key);
      }
    } catch {
      // sandboxed environment - use memory
    }
    return memoryStorage.get(key) || null;
  },
  
  setItem: (key, value) => {
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
        sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // sandboxed environment - use memory
    }
    memoryStorage.set(key, value);
  },
  
  removeItem: (key) => {
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
        sessionStorage.removeItem(key);
        return;
      }
    } catch {
      // sandboxed environment - use memory
    }
    memoryStorage.delete(key);
  },
  
  clear: () => {
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
        sessionStorage.clear();
        return;
      }
    } catch {
      // sandboxed environment - use memory
    }
    memoryStorage.clear();
  }
};

// Helper functions for useSafeStorage hook
export const safeGet = (key, defaultValue = null) => {
  try {
    const item = safeStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeSet = (key, value) => {
  try {
    safeStorage.setItem(key, value);
  } catch (error) {
    console.warn(`safeSet failed for key '${key}':`, error.message);
  }
};

export default safeStorage;
