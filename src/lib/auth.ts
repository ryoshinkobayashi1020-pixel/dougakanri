import { Role } from "./types";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { ROLE_EMAIL } from "./roleAccounts";

const PLACEHOLDER_PASSWORDS: Record<Role, string> = {
  shooter: "satsuei2026",
  editor: "henshu2026",
};

export async function verifyPassword(
  role: Role,
  password: string,
): Promise<boolean> {
  if (!password) return false;

  if (!isSupabaseConfigured) {
    return password === PLACEHOLDER_PASSWORDS[role];
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: ROLE_EMAIL[role],
    password,
  });

  if (error) {
    console.error("signInWithPassword failed", error.message);
    return false;
  }

  return true;
}
