// src/domain/entities/User.ts
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'FROZEN';
export type UserRole = 'MEMBER' | 'LIBRARIAN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  status: MemberStatus;
  studentId?: string;
  address?: string;
  membershipStart?: Date;
  membershipEnd?: Date;
  freezeReason?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
