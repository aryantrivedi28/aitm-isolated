import { SignJWT, jwtVerify, JWTPayload } from "jose";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET
);

export async function signToken(
  payload: Record<string, unknown>,
  expiresIn: string | number = "12h"
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload;
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return null;
  }
}
