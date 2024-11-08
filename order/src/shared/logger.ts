export class Logger {
  private readonly className: string;
  constructor(className: string) {
    this.className = className;
  }
  log(...input: any) {
    console.log(`[${new Date().toISOString()}][${this.className}] ${input}`);
  }

  warn(...input: any) {
    console.log(`[${new Date().toISOString()}][${this.className}] ${input}`);
  }

  debug(...input: any) {
    console.log(`[${new Date().toISOString()}][${this.className}] ${input}`);
  }

  stackTrace(...input: any) {
    console.log(`[${new Date().toISOString()}][${this.className}] ${input}`);
  }
}
