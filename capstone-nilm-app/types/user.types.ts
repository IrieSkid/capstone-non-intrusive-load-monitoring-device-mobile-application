/**
 * User Type Definitions
 * Based on the Firestore schema from database design
 */

export type UserRole = 'admin' | 'landlord' | 'tenant';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profilePhotoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
