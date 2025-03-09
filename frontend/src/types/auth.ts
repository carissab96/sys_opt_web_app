// src/types/auth.ts
export interface UserProfile {
  operating_system: 'linux' | 'windows' | 'macos';
  os_version: string;
  linux_distro?: string;
  linux_distro_version?: string;
  cpu_cores?: number;
  total_memory?: number;
}

export interface UserPreferences {
  optimization_level: 'conservative' | 'balanced' | 'aggressive';
  notification_preferences: Record<string, any>;
  system_settings: Record<string, any>;
}

export interface AuthState {
  user: null | {
    id: string;
    username: string;
    profile: UserProfile;
    preferences: UserPreferences;
  };
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
