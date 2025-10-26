'use client';

import {createContext, useContext, useEffect, useMemo, useState} from 'react';

const UiModeContext = createContext(null);
const STORAGE_KEY = 'pii-admin-ui-mode';
const DEFAULT_MODE = process.env.NEXT_PUBLIC_DEFAULT_UI_MODE ?? 'modern';
const SUPPORTED_MODES = ['modern', 'legacy'];

function sanitizeMode(value) {
  if (!value) return DEFAULT_MODE;
  return SUPPORTED_MODES.includes(value) ? value : DEFAULT_MODE;
}

export function UiModeProvider({children}) {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_MODE;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return sanitizeMode(stored);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && sanitizeMode(stored) !== mode) {
      setModeState(sanitizeMode(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.dataset.uiMode = mode;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const setMode = (value) => {
    setModeState(sanitizeMode(value));
  };

  const value = useMemo(() => ({mode, setMode}), [mode]);

  return <UiModeContext.Provider value={value}>{children}</UiModeContext.Provider>;
}

export function useUiMode() {
  const context = useContext(UiModeContext);
  if (!context) {
    throw new Error('useUiMode는 UiModeProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
