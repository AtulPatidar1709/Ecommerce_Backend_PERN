export function isJwtPayload(obj: unknown): obj is { sub: string; role: string; email?: string } {
  if (typeof obj !== 'object' || obj === null) return false;

  const o = obj as Record<string, unknown>;

  return (
    typeof o.sub === 'string' &&
    typeof o.role === 'string' &&
    (o.email === undefined || typeof o.email === 'string')
  );
}
