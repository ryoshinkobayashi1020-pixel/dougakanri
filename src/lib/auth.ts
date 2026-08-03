import { Role } from "./types";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { SHOOTER_EMAIL, fetchEditorEmails } from "./roleAccounts";

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

  if (role === "shooter") {
    const { error } = await supabase.auth.signInWithPassword({
      email: SHOOTER_EMAIL,
      password,
    });
    return !error;
  }

  const editorEmails = await fetchEditorEmails();
  for (const email of editorEmails) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) return true;
  }

  return false;
}
