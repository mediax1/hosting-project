import { cookies } from "next/headers";

export type AuthUser = {
  id: string;
  username: string;
  avatar: string | null;
  email: string | null;
};

export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(decoded) as AuthUser;
  } catch {
    return null;
  }
}

export function getAvatarUrl(user: AuthUser): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  const defaultAvatar = parseInt(user.id) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
}