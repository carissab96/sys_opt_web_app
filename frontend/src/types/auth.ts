// src/types/auth.ts
export interface User {
    id: string;
    username: string;
    email: string;
    profile: UserProfile;
    preferences: UserPreferences;
    system_id: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  