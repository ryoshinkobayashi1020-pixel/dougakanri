import { Role } from "./types";

export const ROLE_EMAIL: Record<Role, string> = {
  shooter: "shooter@dougakanri.local",
  editor: "editor@dougakanri.local",
};

export function roleFromEmail(email: string | undefined | null): Role | null {
  if (!email) return null;
  const entry = (Object.entries(ROLE_EMAIL) as [Role, string][]).find(
    ([, roleEmail]) => roleEmail === email,
  );
  return entry?.[0] ?? null;
}
