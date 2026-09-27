export const roles = ['ADMIN', 'WAREHOUSE_MANAGER', 'EMPLOYEE', 'SUPPLIER'] as const;
export type Role = (typeof roles)[number];

export type AuthenticatedUser = {
  id: string;
  role: Role;
};

export type LoginCommand = {
  email: string;
  password: string;
};
