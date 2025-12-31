/**
 * SafeStorage Utility
 * 
 * Provides a safe wrapper around browser storage APIs (localStorage, sessionStorage).
 * Falls back to in-memory storage when storage APIs are unavailable (e.g., sandboxed iframes).
 * All operations are wrapped in try/catch to prevent crashes.
 */

// In-memory fallback storage
const memoryStorage = new Map();

/**
 * Check if localStorage is available
 * @returns {boolean} true if localStorage is accessible
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Check availability once at load time
const storageAvailable = isLocalStorageAvailable();

/**
 * SafeStorage class for safe browser storage operations
 */
class SafeStorage {
  constructor() {
    this.useMemoryFallback = !storageAvailable;
  }

  /**
   * Get an item from storage
   * @param {string} key - The key to retrieve
   * @param {*} defaultValue - Value to return if key not found
   * @returns {*} The stored value or defaultValue
   */
  get(key, defaultValue = null) {
    try {
      if (!this.useMemoryFallback && storageAvailable) {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      } else {
        // Use memory fallback
        return memoryStorage.get(key) ?? defaultValue;
      }
    } catch (error) {
      console.warn(`SafeStorage.get('${key}') failed:`, error.message);
      return defaultValue;
    }
  }

  /**
   * Set an item in storage
   * @param {string} key - The key to set
   * @param {*} value - The value to store (will be JSON stringified if not a string)
   * @returns {boolean} true if successful
   */
  set(key, value) {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      
      if (!this.useMemoryFallback && storageAvailable) {
        localStorage.setItem(key, valueToStore);
      } else {
        memoryStorage.set(key, valueToStore);
      }
      return true;
    } catch (error) {
      console.warn(`SafeStorage.set('${key}') failed:`, error.message);
      return false;
    }
  }

  /**
   * Remove an item from storage
   * @param {string} key - The key to remove
   * @returns {boolean} true if successful
   */
  remove(key) {
    try {
      if (!this.useMemoryFallback && storageAvailable) {
        localStorage.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }
      return true;
    } catch (error) {
      console.warn(`SafeStorage.remove('${key}') failed:`, error.message);
      return false;
    }
  }

  /**
   * Clear all items from storage
   * @returns {boolean} true if successful
   */
  clear() {
    try {
      if (!this.useMemoryFallback && storageAvailable) {
        localStorage.clear();
      } else {
        memoryStorage.clear();
      }
      return true;
    } catch (error) {
      console.warn('SafeStorage.clear() failed:', error.message);
      return false;
    }
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - The key to check
   * @returns {boolean} true if key exists
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get all keys as an array
   * @returns {string[]} Array of keys
   */
  keys() {
    try {
      if (!this.useMemoryFallback && storageAvailable) {
        return Object.keys(localStorage);
      } else {
        return Array.from(memoryStorage.keys());
      }
    } catch (error) {
      console.warn('SafeStorage.keys() failed:', error.message);
      return [];
    }
  }
}

// Create singleton instance
export const safeStorage = new SafeStorage();

// Export individual functions for convenience
export const safeGet = (key, defaultValue) => safeStorage.get(key, defaultValue);
export const safeSet = (key, value) => safeStorage.set(key, value);
export const safeRemove = (key) => safeStorage.remove(key);
export const safeClear = () => safeStorage.clear();
export const safeHas = (key) => safeStorage.has(key);

export default safeStorage;

