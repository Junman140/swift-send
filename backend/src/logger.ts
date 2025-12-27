export function info(...args: any[]) {
  console.log(new Date().toISOString(), 'INFO', ...args);
}

export function warn(...args: any[]) {
  console.warn(new Date().toISOString(), 'WARN', ...args);
}

export function error(...args: any[]) {
  console.error(new Date().toISOString(), 'ERROR', ...args);
}
