/**
 * Firma y verificación de la cookie de sesión mediante HMAC-SHA256 (Web Crypto API).
 * No importa Prisma: puede usarse tanto en Server Actions/Components (Node)
 * como en `middleware.ts` (Edge runtime).
 */

export const SESSION_COOKIE_NAME = 'dalia_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

export interface SessionPayload {
  userId: string;
  email: string;
  exp: number; // unix timestamp en segundos
}

function base64UrlEncode(bytes: Uint8Array): string {
  const base64 = Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(Buffer.from(padded, 'base64'));
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const data = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [data, signature] = token.split('.');
  if (!data || !signature) return null;

  const key = await getKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlDecode(signature),
    new TextEncoder().encode(data)
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(data))) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
