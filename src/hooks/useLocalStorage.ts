import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export function useHasVisited(): [boolean, () => void] {
  const [hasVisited, setHasVisited] = useLocalStorage('hasVisited', false);

  const markAsVisited = useCallback(() => {
    setHasVisited(true);
  }, [setHasVisited]);

  return [hasVisited, markAsVisited];
}

export function useCaseStudiesOpened(): [boolean, () => void] {
  const [hasOpened, setHasOpened] = useLocalStorage('caseStudiesOpened', false);

  const markAsOpened = useCallback(() => {
    setHasOpened(true);
  }, [setHasOpened]);

  return [hasOpened, markAsOpened];
}
