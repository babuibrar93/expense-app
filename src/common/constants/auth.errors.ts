export const AuthErrors = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_IN_USE: 'Email is already in use',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_AUTH0_TOKEN: 'Invalid Auth0 token',
  INVALID_OAUTH: 'Invalid OAuth user data',
  USER_ALREADY_EXISTS: 'User already exists',
} as const;
