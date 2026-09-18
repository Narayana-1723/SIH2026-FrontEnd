export type UserRole = 'USER' | 'ADMIN' | 'REVIEWER';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  cpse: string;
  role: UserRole;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
  createdAt: string;
}
