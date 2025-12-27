export function ok(data: any, meta?: any) {
  return { data, meta };
}

export function fail(code: string, message: string, details?: any) {
  return { error: { code, message, details } };
}
