// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const userRaw = localStorage.getItem('user');

//     try {
//       const userData = userRaw ? JSON.parse(userRaw) : null;

//       if (storedToken && userData) {
//         setIsLoggedIn(true);
//         setUser(userData);
//         setToken(storedToken);
//       }
//     } catch (err) {
//       console.error('Failed to parse user data from localStorage:', err);

//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//       setIsLoggedIn(false);
//       setUser(null);
//       setToken(null);
//     }
//   }, []);

//   const login = (newToken, userData) => {
//     try {
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setIsLoggedIn(true);
//       setUser(userData);
//       setToken(newToken);
//     } catch (err) {
//       console.error('Login failed to save user data to localStorage:', err);

//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, token, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Create axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // backend base url
    withCredentials: true, // allows cookies for refresh token
  });

  // Attach Authorization header if token exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // Interceptor to handle expired token
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Call refresh token API
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
            { withCredentials: true }
          );

          // Save new access token
          localStorage.setItem("token", data.accessToken);
          setToken(data.accessToken);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

          return api(originalRequest); // retry the failed request
        } catch (refreshError) {
          console.error("❌ Refresh token failed", refreshError);
          logout(); // logout user
        }
      }
      return Promise.reject(err);
    }
  );

  // Load user + token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    try {
      const userData = userRaw ? JSON.parse(userRaw) : null;
      if (storedToken && userData) {
        setIsLoggedIn(true);
        setUser(userData);
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to parse user data from localStorage:", err);
      logout();
    }
  }, []);

  const login = (newToken, userData) => {
    try {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
      setToken(newToken);
    } catch (err) {
      console.error("Login failed to save user data:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, token, api, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
