export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REGISTER: '/api/auth/register',
  },
} as const;

export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
} as const;
