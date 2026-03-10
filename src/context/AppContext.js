import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStudents, getHalls, getExams, getTopStudents } from '../shared/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser]               = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken]             = useState(() => localStorage.getItem('token') || null);
  const [students, setStudents]       = useState([]);
  const [halls, setHalls]             = useState([]);
  const [exams, setExams]             = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading]         = useState(false);

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
  };

  const refreshData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, h, e, t] = await Promise.all([
        getStudents(), getHalls(), getExams(), getTopStudents()
      ]);
      setStudents(s);
      setHalls(h);
      setExams(e);
      setTopStudents(t);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, [token]);

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