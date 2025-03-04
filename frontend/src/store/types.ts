export interface SystemMetric {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_usage: number;
  timestamp: string;
}

export interface MetricsState {
  data: SystemMetric | null;
  historicalData: SystemMetric[]; 
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  };

  
  export interface UserProfile {
    id: string;
    username: string;
    operating_system: 'linux' | 'windows' | 'macos';
    os_version: string;
    linux_distro?: string;
    linux_distro_version?: string;
    cpu_cores?: number;
    total_memory?: number;
  }
  
  export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
  }

