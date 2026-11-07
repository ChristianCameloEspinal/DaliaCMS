import { cookies } from 'next/headers';
import { userRepository } from '@/db/repositories/user.repository';
import { verifyPassword } from './password';
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
  type SessionPayload,
} from './session';

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET no está configurado');
  }
  return secret;
}

/** Valida credenciales y crea la cookie de sesión. Lanza Error si son inválidas. */
export async function login(email: string, password: string): Promise<void> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const valid = await verifyPassword(password, user.user_pass);
  if (!valid) {
    throw new Error('Credenciales inválidas');
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = await signSession({ userId: user.id, email: user.user_email, exp }, getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

/** Cierra la sesión actual eliminando la cookie. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Lee y verifica la cookie de sesión actual. Devuelve null si no hay sesión válida. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySession(token, getSessionSecret());
}
