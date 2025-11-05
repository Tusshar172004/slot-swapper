export const saveAuth = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('storage')); 
};

export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('storage'));
  window.location.href = '/login';
};
