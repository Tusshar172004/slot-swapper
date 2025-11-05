// frontend/src/utils/auth.js
export const saveAuth = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Notify other components (like Navbar) that auth has changed
  window.dispatchEvent(new Event('storage')); 
};

export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Notify others that user logged out
  window.dispatchEvent(new Event('storage'));
  window.location.href = '/login';
};
