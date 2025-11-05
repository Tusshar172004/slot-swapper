import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser, logout } from '../utils/auth.js';

export default function Navbar() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    // Listen for login/logout changes
    const handleAuthChange = () => setUser(getUser());
    window.addEventListener('storage', handleAuthChange);

    // Cleanup when Navbar unmounts
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl text-indigo-600">SlotSwapper</Link>
          {user && (
            <>
              <Link to="/marketplace" className="text-sm hover:text-indigo-600">Marketplace</Link>
              <Link to="/requests" className="text-sm hover:text-indigo-600">Requests</Link>
            </>
          )}
        </div>

        <div>
          {user ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
