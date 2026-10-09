const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ROLES = ["customer", "seller"];

// Each validator returns an error message, or "" when the value is valid.
export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address";
  return "";
};

export const validatePassword = (password) => (password ? "" : "Password is required");

export const validateRegister = ({ role, email, password, confirmPassword }) => {
  const errors = {
    role: ROLES.includes(role) ? "" : "Choose whether you want to register as a customer or a seller",
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: confirmPassword === password ? "" : "Passwords do not match",
  };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
};

export const validateLogin = ({ email, password }) => {
  const errors = { email: validateEmail(email), password: validatePassword(password) };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
};
