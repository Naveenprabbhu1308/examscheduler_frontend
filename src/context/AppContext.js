import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStudents, getHalls, getExams, getTopStudents } from '../shared/api';

const AppContext = createContext();

const CACHE_KEY = 'appDataCache';
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

const saveCache = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
};

const loadCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null; // expired
    return data;
  } catch {
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser]               = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken]             = useState(() => localStorage.getItem('token') || null);
  const [students, setStudents]       = useState([]);
  const [halls, setHalls]             = useState([]);
  const [exams, setExams]             = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading]         = useState(false);
  const keepAliveRef                  = useRef(null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem(CACHE_KEY);
    if (keepAliveRef.current) clearInterval(keepAliveRef.current);
  };

  const applyData = (s, h, e, t) => {
    setStudents(Array.isArray(s) ? s : []);
    setHalls(Array.isArray(h) ? h : []);
    setExams(Array.isArray(e) ? e : []);
    setTopStudents(Array.isArray(t) ? t : []);
  };

  const refreshData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, h, e, t] = await Promise.all([
        getStudents(), getHalls(), getExams(), getTopStudents()
      ]);
      applyData(s, h, e, t);
      saveCache({ s, h, e, t });
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    // Load from cache instantly (no spinner flash)
    const cached = loadCache();
    if (cached) {
      applyData(cached.s, cached.h, cached.e, cached.t);
    }

    // Then fetch fresh data in background
    refreshData();

    // Keep Railway awake — ping every 5 minutes
    keepAliveRef.current = setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/health`)
        .catch(() => {}); // silent fail
    }, 5 * 60 * 1000);

    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, [token]);

  return (
    <AppContext.Provider value={{
      user, token, login, logout,
      students, setStudents,
      halls, setHalls,
      exams, setExams,
      topStudents,
      loading, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;