import { Role } from "./types";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { SHOOTER_EMAIL } from "./roleAccounts";

const PLACEHOLDER_PASSWORDS: Record<Role, string> = {
  shooter: "satsuei2026",
  editor: "henshu2026",
};

export async function verifyPassword(
  role: Role,
  password: string,
  editorEmail?: string,
): Promise<boolean> {
  if (!password) return false;
  if (role === "editor" && !editorEmail) return false;

  if (!isSupabaseConfigured) {
    return password === PLACEHOLDER_PASSWORDS[role];
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: role === "shooter" ? SHOOTER_EMAIL : editorEmail!,
    password,
  });

  if (error) {
    console.error("signInWithPassword failed", error.message);
    return false;
  }

  return true;
}
