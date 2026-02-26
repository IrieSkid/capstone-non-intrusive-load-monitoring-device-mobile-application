/**
 * Custom Hook for Authentication
 * Provides easy access to auth context
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { UserRegistrationData } from '@/types/user.types';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Backwards-compatible register helper.
   *
   * Some screens call: register(email, password, firstName, lastName, role, phone)
   * while AuthContext.register expects: register(data: UserRegistrationData)
   */
  const register = async (
    emailOrData: string | UserRegistrationData,
    password?: string,
    firstName?: string,
    lastName?: string,
    role?: 'tenant' | 'landlord' | 'admin',
    phoneNumber?: string
  ) => {
    if (typeof emailOrData === 'string') {
      const data: UserRegistrationData = {
        email: emailOrData,
        password: password || '',
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber: phoneNumber || undefined,
        role: role || 'tenant',
      };
      return context.register(data);
    }

    return context.register(emailOrData);
  };

  return { ...context, register };
};
