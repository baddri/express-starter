/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { format, createLogger, transports } from 'winston';
import { env } from '../../env';

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

const log = createLogger({
  level: env.node === 'development' ? 'info' : 'alert',
  format: format.json(),
  transports: [
    new transports.Console({
      format:
        env.node !== 'development'
          ? format.combine(format.json())
          : format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export class Logger {
  public static DEFAULT_SCOPE = 'app';

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
    }
    return filepath;
  }

  private scope: string;

  constructor(scope?: string) {
    this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
  }

  public debug(message: string, ...args: any[]): void {
    log.debug(this.formatScope(message), args);
  }

  public info(message: string, ...args: any[]): void {
    log.info(this.formatScope(message), args);
  }

  public warn(message: string, ...args: any[]): void {
    log.warn(this.formatScope(message), args);
  }

  public error(message: string, ...args: any[]): void {
    log.error(this.formatScope(message), args);
  }

  private formatScope(message: string): string {
    return `[${this.scope}] ${message}`;
  }
}
