import { Role } from "./types";

export const SHOOTER_EMAIL = "shooter@dougakanri.local";

export function roleFromEmail(email: string | undefined | null): Role | null {
  if (!email) return null;
  return email === SHOOTER_EMAIL ? "shooter" : "editor";
}
