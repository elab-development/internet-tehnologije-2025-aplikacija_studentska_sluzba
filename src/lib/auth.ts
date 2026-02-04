import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth";

const JWT_SECRET = process.env.JWT_SECRET || "tajnikljuc123";
export type JwtUserClaims = {
  sub: number;     
  email: string;
  role: string;
  name?: string;
};

export interface TokenData {
  userId: number;
  email: string;
  role: string;
}

export function signAuthToken(claims: JwtUserClaims): string {
  return jwt.sign(claims, JWT_SECRET, { 
    algorithm: "HS256", 
    expiresIn: "7d" 
  });
}

export function verifyAuthToken(token: string): JwtUserClaims {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims;
  
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid token");
  }
  
  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };
}

export function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dana
  };
}

export async function proveraAuth(): Promise<JwtUserClaims | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const podaci = verifyAuthToken(token);
    return podaci;
  } catch {
    return null;
  }
}