import { signSession, verifySession, type SessionPayload } from '@/core/auth/session';

const SECRET = 'test-secret';

function futureExp(): number {
  return Math.floor(Date.now() / 1000) + 60;
}

function pastExp(): number {
  return Math.floor(Date.now() / 1000) - 60;
}

describe('session', () => {
  it('firma y verifica un token válido', async () => {
    const payload: SessionPayload = { userId: 'u1', email: 'admin@example.com', exp: futureExp() };

    const token = await signSession(payload, SECRET);
    const result = await verifySession(token, SECRET);

    expect(result).toEqual(payload);
  });

  it('devuelve null si el token está expirado', async () => {
    const payload: SessionPayload = { userId: 'u1', email: 'admin@example.com', exp: pastExp() };

    const token = await signSession(payload, SECRET);
    const result = await verifySession(token, SECRET);

    expect(result).toBeNull();
  });

  it('devuelve null si la firma no coincide con el secreto', async () => {
    const payload: SessionPayload = { userId: 'u1', email: 'admin@example.com', exp: futureExp() };

    const token = await signSession(payload, SECRET);
    const result = await verifySession(token, 'otro-secreto');

    expect(result).toBeNull();
  });

  it('devuelve null si el token está malformado', async () => {
    expect(await verifySession('token-sin-punto', SECRET)).toBeNull();
    expect(await verifySession(undefined, SECRET)).toBeNull();
  });
});
