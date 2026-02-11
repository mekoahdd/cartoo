/**
 * LogLevel - Log level enumeration
 */
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * LoggerConfig - Logger configuration interface
 */
interface LoggerConfig {
    enabled: boolean;
    level: LogLevel;
    prefix?: string;
}

/**
 * Logger - Centralized logging service
 * 
 * Provides structured logging with levels and contexts.
 * In production, this can be extended to send logs to external services.
 * 
 * Benefits:
 * - Centralized control over logging
 * - Easy to disable logs in production
 * - Can be extended to send to external services (Sentry, LogRocket, etc.)
 * - Consistent log formatting
 * - Log level filtering
 * 
 * @example
 * Logger.info('User logged in', { userId: 123 });
 * Logger.error('Failed to fetch data', error);
 * Logger.debug('Debug info', { state });
 */
class LoggerService {
    private config: LoggerConfig = {
        enabled: process.env.NODE_ENV !== 'production',
        level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
        prefix: '[App]',
    };

    private shouldLog(level: LogLevel): boolean {
        if (!this.config.enabled) {
            return false;
        }

        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        const currentLevelIndex = levels.indexOf(this.config.level);
        const requestedLevelIndex = levels.indexOf(level);

        return requestedLevelIndex >= currentLevelIndex;
    }

    private formatMessage(level: LogLevel, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString();
        const prefix = this.config.prefix || '';
        return `${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`;
    }

    /**
     * Log debug messages (only in development)
     */
    debug(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message), data ?? '');
        }
    }

    /**
     * Log informational messages
     */
    info(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(LogLevel.INFO, message), data ?? '');
        }
    }

    /**
     * Log warning messages
     */
    warn(message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(LogLevel.WARN, message), data ?? '');
        }
    }

    /**
     * Log error messages
     */
    error(message: string, error?: unknown): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(LogLevel.ERROR, message), error ?? '');
            
            // In production, you might want to send to error tracking service:
            // if (process.env.NODE_ENV === 'production') {
            //     sendToErrorTrackingService(message, error);
            // }
        }
    }

    /**
     * Configure the logger
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Get current configuration
     */
    getConfig(): LoggerConfig {
        return { ...this.config };
    }
}

// Export singleton instance
export const Logger = new LoggerService();
