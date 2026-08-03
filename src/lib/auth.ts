import { Role } from "./types";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { SHOOTER_EMAIL, fetchEditorEmails } from "./roleAccounts";

const PLACEHOLDER_PASSWORDS: Record<Role, string> = {
  shooter: "satsuei2026",
  editor: "henshu2026",
};

interface LoginResult {
  ok: boolean;
  email?: string;
}

export async function verifyPassword(
  role: Role,
  password: string,
): Promise<LoginResult> {
  if (!password) return { ok: false };

  if (!isSupabaseConfigured) {
    return { ok: password === PLACEHOLDER_PASSWORDS[role] };
  }

  if (role === "shooter") {
    const { error } = await supabase.auth.signInWithPassword({
      email: SHOOTER_EMAIL,
      password,
    });
    return { ok: !error, email: SHOOTER_EMAIL };
  }

  const editorEmails = await fetchEditorEmails();
  for (const email of editorEmails) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) return { ok: true, email };
  }

  return { ok: false };
}
