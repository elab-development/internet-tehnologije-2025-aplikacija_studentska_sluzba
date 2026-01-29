import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "tajnikljuc123";

export interface TokenData {
  userId: number;
  email: string;
  role: string;
}

export async function proveraAuth(): Promise<TokenData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const podaci = jwt.verify(token, SECRET) as TokenData;
    return podaci;
  } catch {
    return null;
  }
}
