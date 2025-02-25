export const AuthError = {
  UserNotFound: 'User not found',
  InvalidCredentials: 'Invalid email or password',
  EmailAlreadyInUse: 'Email is already in use',
  InvalidToken: 'Invalid or expired token',
  InvalidAuth0Token: 'Invalid Auth0 token',
  InvalidOAuth: 'Invalid OAuth user data',
  alreadyExists: 'User already exists',
  organizationsRequired: 'Organizations are required',
} as const;

export const GeneralError = {
  recordNotFound: 'Record not found',
  ForbiddenRole: 'You do not have the required role to access this resource.',
  forbiddenPermission: 'You do not have the required permissions.',
} as const;

export const OrganizationError = {
  alreadyExists: 'Organization already exists',
  notFound: 'Organization not found',
  userNotFound: 'User is not part of this organization.',
} as const;

export const RoleError = {
  alreadyExists: 'Role already exists',
  notFound: 'Role not found',
  userAlreadyHasRole: 'User already has this role in the organization.',
} as const;
