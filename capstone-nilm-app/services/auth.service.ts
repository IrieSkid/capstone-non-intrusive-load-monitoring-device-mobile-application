/**
 * Authentication Service
 * Handles all Firebase Authentication operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, UserRegistrationData, UserUpdateData } from '@/types/user.types';

/**
 * Register a new user
 */
export const registerUser = async (
  data: UserRegistrationData
): Promise<User> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(firebaseUser, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role || 'tenant',
      isActive: true,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to register user');
  }
};

/**
 * Sign in with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      profilePhotoUrl: userData.profilePhotoUrl,
      isActive: userData.isActive,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate(),
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

/**
 * Sign out the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUserData = async (
  userId: string
): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    return {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      profilePhotoUrl: userData.profilePhotoUrl,
      isActive: userData.isActive,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate(),
    };
  } catch (error: any) {
    console.error('Get user data error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  data: UserUpdateData
): Promise<void> => {
  try {
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, 'users', userId), updateData);

    // Update display name in Firebase Auth if name changed
    if (data.firstName || data.lastName) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        });
      }
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};
