const SystemStatus: React.FC<{ loading: boolean; error: string | null }> = ({ loading, error }) => {
    return (
      <div className="system-status">
        <div className="status-wrapper">
          <span 
            className={`status-dot ${
              loading ? 'status-loading' : 
              error ? 'status-error' : 
              'status-active'
            }`}
          />
          <span className="status-message">
            {loading && (
              <>
                <i className="fas fa-sync-alt" /> 
                Updating metrics and shit...
              </>
            )}
            {error && (
              <>
                <i className="fas fa-exclamation-triangle" /> 
                Fuck! {error}
              </>
            )}
            {!loading && !error && (
              <>
                <i className="fas fa-check-circle" /> 
                System Monitoring Active (and actually fucking working)
              </>
            )}
          </span>
        </div>
      </div>
    );
  };
  export default SystemStatus;