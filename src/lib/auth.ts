import { Role } from "./types";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

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

  const { data, error } = await supabase.rpc("verify_role_password", {
    p_role: role,
    p_password: password,
  });

  if (error) {
    console.error("verifyPassword failed", error);
    return false;
  }

  return data === true;
}
