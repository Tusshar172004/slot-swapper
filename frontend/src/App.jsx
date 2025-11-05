import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Requests from './pages/Requests.jsx';

const Protected = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // hide navbar on login/signup
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {!hideNavbar && <Navbar />}
      <div className={`flex-1 ${hideNavbar ? 'flex items-center justify-center' : 'container mx-auto p-4'}`}>
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />}
          />

          {/* Auth pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected pages */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
          <Route path="/requests" element={<Protected><Requests /></Protected>} />
        </Routes>
      </div>
    </div>
  );
}
