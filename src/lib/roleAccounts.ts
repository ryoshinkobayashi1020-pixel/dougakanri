import { Role } from "./types";
import { supabase } from "./supabaseClient";

export const SHOOTER_EMAIL = "shooter@dougakanri.local";

export function roleFromEmail(email: string | undefined | null): Role | null {
  if (!email) return null;
  return email === SHOOTER_EMAIL ? "shooter" : "editor";
}

export async function registerEditorEmail(email: string): Promise<void> {
  const trimmed = email.trim();
  if (!trimmed) return;
  const { error } = await supabase
    .from("editor_accounts")
    .upsert({ email: trimmed }, { onConflict: "email" });
  if (error) {
    console.error("registerEditorEmail failed", error);
  }
}
