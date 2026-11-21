import type { LogContext, Logger } from '../../application/ports/Logger.js';

/** One JSON object per line: easy to read, easy for log tools to parse. Never logs visitor data. */
export class ConsoleLogger implements Logger {
  constructor(private readonly silent = false) {}

  info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  private write(level: 'info' | 'warn' | 'error', message: string, context?: LogContext): void {
    if (this.silent) return;
    const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...context });
    (level === 'error' ? console.error : console.log)(line);
  }
}
