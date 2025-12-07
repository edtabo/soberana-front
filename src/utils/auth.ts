import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserRole(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.decode(token) as { role?: string; roles?: string[]; } | null;

    if (!decoded) return null;

    if (decoded.role) return Number(decoded.role);

    if (decoded.roles && Array.isArray(decoded.roles)) return Number(decoded.roles[0]);

    return 0;
  } catch (error) {
    console.error('Error decoding token to get role:', error);
    return null;
  }
}
