// components/dashboard/Dashboard/SystemStatus/SystemStatus.tsx
import React from 'react';
import './SystemStatus.css';

export interface SystemStatusProps {
    loading: boolean;
    error: string | null;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ loading, error }) => {
    const getStatusClass = () => {
        if (loading) return 'status-loading';
        if (error) return 'status-error';
        return 'status-active';
    };

    const getStatusMessage = () => {
        if (loading) {
            return (
                <span className="status-message loading">
                    <i className="fas fa-sync-alt"></i> Optimizing your shit...
                </span>
            );
        }
        if (error) {
            return (
                <span className="status-message error">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </span>
            );
        }
        return (
            <span className="status-message active">
                <i className="fas fa-check-circle"></i> System's running smooth as fuck
            </span>
        );
    };

    return (
        <div className="system-status">
            <span className="status-indicator">
                <span className={`status-dot ${getStatusClass()}`} />
                <span className="status-text">
                    {getStatusMessage()}
                </span>
            </span>
        </div>
    );
};
export default SystemStatus;