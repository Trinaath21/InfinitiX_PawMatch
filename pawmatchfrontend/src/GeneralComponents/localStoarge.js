// localStorage.js
const LOCAL_STORAGE_KEY = {
  TOKEN: "authToken",
  ROLE: "role",
};

// Function to save the auth token
export const saveAuthToken = (token) => {
  localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
};

// Function to retrieve the auth token
export const getAuthToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN);
};

// Function to remove the auth token
export const removeAuthToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
};

// Function to save the user's role
export const saveUserRole = (role) => {
  localStorage.setItem(LOCAL_STORAGE_KEY.ROLE, role);
};

// Function to retrieve the user's role
export const getUserRole = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY.ROLE);
};

// Function to remove the user's role
export const removeUserRole = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.ROLE);
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Function to clear all user-related data (for logout)
export const clearUserData = () => {
  removeAuthToken();
  removeUserRole();
};
