import React from 'react';
import { 
  Compass, 
  RotateCcw, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  MessageSquare, 
  WifiOff, 
  AlertTriangle 
} from 'lucide-react';
import styles from '../styles/ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDiagnostics: false,
      copied: false,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CBSI ErrorBoundary captured an error:', error, errorInfo);
    this.setState({ errorInfo });

    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOnline: navigator.onLine });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDiagnostics: false
    });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleNavigateHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    const payload = [
      `--- CB S INTERNATIONAL ERROR REPORT ---`,
      `Timestamp: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Online: ${navigator.onLine}`,
      `Message: ${error?.message || 'Unknown error'}`,
      `Stack: ${error?.stack || 'N/A'}`,
      `Component Stack: ${errorInfo?.componentStack || 'N/A'}`
    ].join('\n');

    navigator.clipboard.writeText(payload).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  };

  toggleDiagnostics = () => {
    this.setState(prev => ({ showDiagnostics: !prev.showDiagnostics }));
  };

  render() {
    const { hasError, error, errorInfo, showDiagnostics, copied, isOnline } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback({ error, resetErrorBoundary: this.handleReset });
        }
        return fallback;
      }

      return (
        <div className={styles.errorWrapper} role="alert">
          <div className={styles.errorCard}>
            <div className={styles.iconWrapper}>
              <Compass size={36} />
            </div>

            <div className={styles.badge}>
              <span>Expedition Alert</span>
            </div>

            <h1 className={styles.title}>
              Trail Interruption Encountered
            </h1>

            <p className={styles.description}>
              We encountered an unexpected glitch while loading this safari expedition view. 
              Our technical guides have logged the event, and your travel data is safe.
            </p>

            {!isOnline && (
              <div className={styles.offlineNotice}>
                <WifiOff size={18} />
                <span>You appear to be offline. Please check your internet connection.</span>
              </div>
            )}

            <div className={styles.actionGrid}>
              <button 
                type="button" 
                className={styles.primaryBtn} 
                onClick={this.handleReset}
                id="error-boundary-retry-btn"
              >
                <RotateCcw size={17} />
                <span>Try Again</span>
              </button>

              <button 
                type="button" 
                className={styles.secondaryBtn} 
                onClick={this.handleNavigateHome}
                id="error-boundary-home-btn"
              >
                <Home size={17} />
                <span>Return to Home</span>
              </button>

              <button 
                type="button" 
                className={styles.secondaryBtn} 
                onClick={this.handleReload}
                id="error-boundary-reload-btn"
              >
                <span>Full Reload</span>
              </button>
            </div>

            <div>
              <a
                href={`https://wa.me/254700000000?text=${encodeURIComponent(
                  `Hi CB S International support, I encountered an issue on page: ${typeof window !== 'undefined' ? window.location.href : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.supportBtn}
              >
                <MessageSquare size={15} />
                <span>WhatsApp Expedition Concierge</span>
              </a>
            </div>

            <div>
              <button 
                type="button" 
                className={styles.diagnosticToggle} 
                onClick={this.toggleDiagnostics}
                aria-expanded={showDiagnostics}
              >
                <AlertTriangle size={14} />
                <span>{showDiagnostics ? 'Hide Technical Diagnostics' : 'View Technical Diagnostics'}</span>
                {showDiagnostics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showDiagnostics && (
                <div className={styles.diagnosticPanel}>
                  <div className={styles.diagnosticHeader}>
                    <span>DIAGNOSTIC LOGS</span>
                    <button 
                      type="button" 
                      className={styles.copyBtn} 
                      onClick={this.handleCopyDetails}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy Log'}</span>
                    </button>
                  </div>
                  <p className={styles.errorText}>
                    {error?.name || 'Error'}: {error?.message || 'An unexpected rendering error occurred.'}
                  </p>
                  {error?.stack && (
                    <pre className={styles.stackTrace}>
                      {error.stack}
                    </pre>
                  )}
                  {errorInfo?.componentStack && (
                    <pre className={styles.stackTrace} style={{ marginTop: '8px', color: '#475569' }}>
                      Component Stack:{errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;