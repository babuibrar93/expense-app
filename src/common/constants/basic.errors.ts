export const AuthErrors = {
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_IN_USE: 'Email is already in use.',
  INVALID_TOKEN: 'Invalid or expired authentication token.',
  INVALID_AUTH0_TOKEN: 'Invalid Auth0 authentication token.',
  INVALID_OAUTH_DATA: 'Invalid OAuth user data received.',
  USER_ALREADY_EXISTS: 'User already exists.',
  ORGANIZATIONS_REQUIRED: 'At least one organization is required.',
} as const;

export const GeneralErrors = {
  RECORD_NOT_FOUND: 'The requested record was not found.',
  FORBIDDEN_ROLE: 'Access denied: You do not have the required role to access this resource.',
  FORBIDDEN_PERMISSION: 'Access denied: You do not have the required permissions.',
  ROLE_ORGANIZATION_REQUIRED: 'Both role and organization are required.',
  USER_NOT_ASSOCIATED_WITH_ORGANIZATION:
    'The user is not associated with any organization. Kindly contact your admin',
  USER_NOT_AUTHORIZED_FOR_ORGANIZATION:
    'Access denied: You do not have permission to access this organization.',
} as const;

export const OrganizationErrors = {
  ORGANIZATION_ALREADY_EXISTS: 'An organization with this name already exists.',
  ORGANIZATION_NOT_FOUND: 'The specified organization was not found.',
  USER_NOT_IN_ORGANIZATION: 'The user is not a member of this organization.',
  USER_ALREADY_IN_ORGANIZATION: 'The user is already a member of this organization.',
  USER_ALREADY_HAS_ROLE_IN_ORGANIZATION: 'The user already has this role in the organization.',
} as const;

export const RoleErrors = {
  ROLE_ALREADY_EXISTS: 'A role with this name already exists.',
  ROLE_NOT_FOUND: 'The specified role was not found.',
  USER_ALREADY_ASSIGNED_ROLE: 'The user is already assigned this role in the organization.',
} as const;

export const ModuleErrors = {
  MODULE_ALREADY_EXISTS: 'A module with this name already exists.',
  MODULE_NOT_FOUND: 'The specified module was not found.',
  PARENT_MODULE_NOT_FOUND: 'The parent module for this module was not found.',
} as const;

export const ExpenseErrors = {
  EXPENSE_ALREADY_EXISTS: 'An expense with this reference already exists.',
  EXPENSE_NOT_FOUND: 'The specified expense was not found.',
} as const;
