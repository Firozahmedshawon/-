export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export const validatePassword = (password) => {
  return password.length >= 6; // কমপক্ষে ৬ অক্ষর
};