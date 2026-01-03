/**
 * Safe Storage Utility - Handles sandboxed environments
 * 
 * Falls back to memory storage when sessionStorage/localStorage
 * are not available (e.g., origin = null, sandboxed iframes)
 */

const memoryStorage = new Map();

// Helper to check if sessionStorage is actually accessible
const canUseSessionStorage = () => {
  try {
    // Check if sessionStorage exists and is accessible
    if (typeof sessionStorage === 'undefined' || sessionStorage === null) {
      return false;
    }
    // Attempt a test write/read to verify access
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    // sandboxed environment or permission denied
    return false;
  }
};

const useSessionStorage = canUseSessionStorage();

export const safeStorage = {
  getItem: (key) => {
    if (useSessionStorage) {
      try {
        return sessionStorage.getItem(key);
      } catch {
        // fallback to memory
      }
    }
    return memoryStorage.get(key) || null;
  },
  
  setItem: (key, value) => {
    if (useSessionStorage) {
      try {
        sessionStorage.setItem(key, value);
        return;
      } catch {
        // fallback to memory
      }
    }
    memoryStorage.set(key, value);
  },
  
  removeItem: (key) => {
    if (useSessionStorage) {
      try {
        sessionStorage.removeItem(key);
        return;
      } catch {
        // fallback to memory
      }
    }
    memoryStorage.delete(key);
  },
  
  clear: () => {
    if (useSessionStorage) {
      try {
        sessionStorage.clear();
        return;
      } catch {
        // fallback to memory
      }
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
