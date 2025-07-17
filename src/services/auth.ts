import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  deleteUser,
  updateProfile,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  farmName?: string;
  location?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

class AuthService {
  /**
   * Create a new user account
   */
  async signUp(email: string, password: string, displayName: string, farmName?: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile in Firebase Auth
      await updateProfile(user, {
        displayName: displayName
      });

      // Store additional profile data in localStorage (since Firestore is not available)
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        farmName: farmName || '',
        location: ''
      };

      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(userProfile));

      return { success: true, user };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: this.getErrorMessage(authError.code) 
      };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: this.getErrorMessage(authError.code) 
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: this.getErrorMessage(authError.code) 
      };
    }
  }

  /**
   * Delete current user account
   */
  async deleteAccount(): Promise<AuthResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user is currently signed in' };
      }

      // Remove user profile from localStorage
      localStorage.removeItem(`userProfile_${user.uid}`);

      // Delete user account
      await deleteUser(user);

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: this.getErrorMessage(authError.code) 
      };
    }
  }

  /**
   * Get user profile from localStorage
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const profileData = localStorage.getItem(`userProfile_${uid}`);
      if (profileData) {
        return JSON.parse(profileData) as UserProfile;
      }
      
      // If no profile in localStorage, create one from Firebase Auth data
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          createdAt: user.metadata.creationTime || new Date().toISOString(),
          farmName: '',
          location: ''
        };
        localStorage.setItem(`userProfile_${uid}`, JSON.stringify(profile));
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile in localStorage
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const existingProfile = await this.getUserProfile(uid);
      if (!existingProfile) return false;

      const updatedProfile = { ...existingProfile, ...updates };
      localStorage.setItem(`userProfile_${uid}`, JSON.stringify(updatedProfile));

      // Also update Firebase Auth profile if displayName changed
      if (updates.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to delete your account.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export const authService = new AuthService();