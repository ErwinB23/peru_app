/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { getProfile } from '../services/authService.js';
import { AUTH_UNAUTHORIZED_EVENT } from '../services/api.js';

export const AuthContext = createContext();

const clearStoredSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredSession();
  }, []);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const validateStoredSession = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const currentUser = await getProfile(storedToken);

        if (!isMounted) return;

        setToken(storedToken);
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
        clearStoredSession();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    validateStoredSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
