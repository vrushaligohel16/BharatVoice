import { useEffect, useState } from 'react';

const SESSION_KEY = 'bharatvoice_session';

export function getIsLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

export function setLoggedIn(value) {
  if (value) {
    localStorage.setItem(SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event('auth-change'));
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

  useEffect(() => {
    const sync = () => setIsLoggedIn(getIsLoggedIn());
    window.addEventListener('auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return {
    isLoggedIn,
    login: () => setLoggedIn(true),
    logout: () => setLoggedIn(false),
  };
}
