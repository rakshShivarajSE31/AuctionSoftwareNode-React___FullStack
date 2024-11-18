

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ProjectList from "./components/ProjectList";
import api from "./services/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await api.get("/auth/session", { withCredentials: true });
      setIsAuthenticated(response.data.loggedIn);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/projects" />}
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <ProjectList onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;


