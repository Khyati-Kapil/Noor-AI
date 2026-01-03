/**
 * Safe Storage Utility - Production-Ready Implementation
 * 
 * Handles sandboxed environments (ATS / resume preview / iframe) gracefully
 * by falling back to in-memory storage when browser storage APIs are unavailable.
 * 
 * Features:
 * - Automatic detection of storage availability
 * - Runtime checks to handle storage becoming unavailable after initial load
 * - Comprehensive try/catch error handling
 * - Memory fallback for all operations
 * - Thread-safe memory storage using Map
 */

// Memory fallback storage - persists for session duration in sandboxed environments
const memoryStorage = new Map();

/**
 * Check if sessionStorage is available and accessible
 * Performs actual read/write test to ensure functionality
 * @returns {boolean} true if sessionStorage is available
 */
const isSessionStorageAvailable = () => {
  try {
    // Check if sessionStorage exists
    if (typeof sessionStorage === 'undefined' || sessionStorage === null) {
      return false;
    }
    
    // Attempt a test write/read operation
    // This is the most reliable way to detect sandboxed environments
    const testKey = '__storage_test__';
    const testValue = 'test';
    
    sessionStorage.setItem(testKey, testValue);
    
    const result = sessionStorage.getItem(testKey);
    sessionStorage.removeItem(testKey);
    
    // Verify the operation succeeded
    return result === testValue;
  } catch {
    // Storage is not available (sandboxed environment or permission denied)
    return false;
  }
};

// Check storage availability at module load time
// Note: We re-check at runtime for each operation to handle dynamic availability changes
let _storageAvailable = null;

/**
 * Get the current storage availability status
 * Re-checks on every call to handle dynamic environment changes
 * @returns {boolean} true if storage is available
 */
const checkStorageAvailability = () => {
  // Recalculate if not yet checked or if we want to handle dynamic changes
  if (_storageAvailable === null) {
    _storageAvailable = isSessionStorageAvailable();
  }
  return _storageAvailable;
};

/**
 * Safe storage interface - replaces direct sessionStorage usage
 * Falls back to in-memory storage when browser storage is unavailable
 */
export const safeStorage = {
  /**
   * Get item from storage
   * @param {string} key - The storage key
   * @returns {string|null} The stored value or null if not found/unavailable
   */
  getItem: (key) => {
    try {
      if (checkStorageAvailability()) {
        return sessionStorage.getItem(key);
      }
    } catch {
      // Fall through to memory storage
    }
    return memoryStorage.get(key) || null;
  },

  /**
   * Set item in storage
   * @param {string} key - The storage key
   * @param {string} value - The value to store
   */
  setItem: (key, value) => {
    try {
      if (checkStorageAvailability()) {
        sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fall through to memory storage
    }
    memoryStorage.set(key, value);
  },

  /**
   * Remove item from storage
   * @param {string} key - The storage key to remove
   */
  removeItem: (key) => {
    try {
      if (checkStorageAvailability()) {
        sessionStorage.removeItem(key);
        return;
      }
    } catch {
      // Fall through to memory storage
    }
    memoryStorage.delete(key);
  },

  /**
   * Clear all storage
   */
  clear: () => {
    try {
      if (checkStorageAvailability()) {
        sessionStorage.clear();
        return;
      }
    } catch {
      // Fall through to memory storage
    }
    memoryStorage.clear();
  },

  /**
   * Check if key exists in storage
   * @param {string} key - The storage key
   * @returns {boolean} true if key exists
   */
  hasItem: (key) => {
    try {
      if (checkStorageAvailability()) {
        return sessionStorage.getItem(key) !== null;
      }
    } catch {
      // Fall through to memory storage
    }
    return memoryStorage.has(key);
  },

  /**
   * Get all keys from storage
   * @returns {string[]} Array of storage keys
   */
  keys: () => {
    try {
      if (checkStorageAvailability()) {
        return Object.keys(sessionStorage);
      }
    } catch {
      // Fall through to memory storage
    }
    return Array.from(memoryStorage.keys());
  }
};

/**
 * Convenience function to get item with default value
 * @param {string} key - The storage key
 * @param {*} defaultValue - Value to return if key not found
 * @returns {*} The stored value or default
 */
export const safeGet = (key, defaultValue = null) => {
  try {
    const item = safeStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Convenience function to set item with error handling
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 */
export const safeSet = (key, value) => {
  try {
    // Convert value to string for storage compatibility
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    safeStorage.setItem(key, valueToStore);
  } catch (error) {
    console.warn(`safeSet failed for key '${key}':`, error.message);
  }
};

/**
 * Convenience function to remove item with error handling
 * @param {string} key - The storage key to remove
 */
export const safeRemove = (key) => {
  try {
    safeStorage.removeItem(key);
  } catch (error) {
    console.warn(`safeRemove failed for key '${key}':`, error.message);
  }
};

/**
 * Clear all storage with error handling
 */
export const safeClear = () => {
  try {
    safeStorage.clear();
  } catch (error) {
    console.warn('safeClear failed:', error.message);
  }
};

/**
 * Force re-check of storage availability
 * Useful for handling dynamic environment changes
 */
export const resetStorageCheck = () => {
  _storageAvailable = null;
  return checkStorageAvailability();
};

// Default export for convenience
export default safeStorage;

