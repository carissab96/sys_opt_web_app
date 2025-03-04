import { useAppSelector } from "../../../store/hooks";

export const UserProfile: React.FC = () => {
    const user = useAppSelector(state => state.auth.user);
    const profile = useAppSelector(state => state.auth.user?.profile);
  
    return (
      <div className="user-profile-card">
        <div className="profile-header">
          <h2>System Profile</h2>
          <button className="edit-button">Edit</button>
        </div>
  
        <div className="system-info">
          <div className="info-group">
            <h3>System Information</h3>
            <div className="info-item">
              <label>Operating System:</label>
              <span>{profile?.operating_system} {profile?.os_version}</span>
            </div>
            {profile?.linux_distro && (
              <div className="info-item">
                <label>Distribution:</label>
                <span>{profile?.linux_distro} {profile?.linux_distro_version}</span>
              </div>
            )}
            <div className="info-item">
              <label>CPU Cores:</label>
              <span>{profile?.cpu_cores}</span>
            </div>
            <div className="info-item">
              <label>Total Memory:</label>
              <span>{(profile?.total_memory || 0) / 1024} GB</span>
            </div>
          </div>
  
          <div className="info-group">
            <h3>Optimization Preferences</h3>
            <div className="info-item">
              <label>Optimization Level:</label>
              <span>{user?.preferences?.optimization_level}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  