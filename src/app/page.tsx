"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { ROLE_THEME } from "@/lib/theme";
import { verifyPassword } from "@/lib/auth";
import { CameraIcon, ClapperIcon, ScissorsIcon } from "@/components/icons";

const ROLE_CARD: Record<Role, { icon: React.ReactNode; bullets: string[] }> = {
  shooter: {
    icon: <CameraIcon className="size-6" />,
    bullets: ["ドライブのリンクを共有", "編集の締切を指定", "対応状況を確認"],
  },
  editor: {
    icon: <ScissorsIcon className="size-6" />,
    bullets: ["案件を一覧で管理", "締切が近い順に表示", "完了報告まで一貫対応"],
  },
};

export default function Home() {
  const { currentUser, setCurrentUser, ready } = useStore();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (ready && currentUser) {
      router.replace(currentUser.role === "shooter" ? "/shooter" : "/editor");
    }
  }, [ready, currentUser, router]);

  if (!ready || currentUser) return null;

  async function handleStart() {
    if (!role || !password) return;
    if (role === "editor" && !email) return;
    setChecking(true);
    setError("");
    const ok = await verifyPassword(role, password, email);
    setChecking(false);
    if (!ok) {
      setError(
        role === "editor"
          ? "メールアドレスかパスワードが違います。"
          : "パスワードが違います。",
      );
      return;
    }
    setCurrentUser({ role });
    router.push(role === "shooter" ? "/shooter" : "/editor");
  }

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full bg-fuchsia-200/40 blur-3xl" />

      <div className="relative w-full max-w-3xl">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <ClapperIcon className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            SNS運用ワークボード
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            役割を選んで、専用のワークスペースに入りましょう
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(["shooter", "editor"] as Role[]).map((r) => {
            const theme = ROLE_THEME[r];
            const card = ROLE_CARD[r];
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                className={`group relative overflow-hidden rounded-3xl border-2 bg-white p-6 text-left shadow-sm transition ${
                  active
                    ? `border-transparent ring-2 ${theme.ring} shadow-lg`
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.gradient} ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`mb-4 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white`}
                >
                  {card.icon}
                </span>
                <p className="mb-1 text-base font-extrabold text-slate-900">
                  {theme.label}として入る
                </p>
                <p className="mb-4 text-xs text-slate-500">{theme.tagline}</p>
                <ul className="space-y-1.5">
                  {card.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
                    >
                      <span
                        className={`size-1.5 rounded-full bg-gradient-to-br ${theme.gradient}`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {role && (
          <div className="mx-auto mt-5 max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {role === "editor" && (
              <>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  担当編集者のメールアドレス
                </p>
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="editor-xxx@dougakanri.local"
                  className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </>
            )}

            <p className="mb-2 text-sm font-bold text-slate-700">
              {ROLE_THEME[role].label}用パスワード
            </p>
            <input
              autoFocus={role === "shooter"}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="パスワードを入力"
              className="mb-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            {error && (
              <p className="mb-3 text-xs font-bold text-rose-600">{error}</p>
            )}

            <button
              type="button"
              disabled={!password || (role === "editor" && !email) || checking}
              onClick={handleStart}
              className={`mt-3 w-full rounded-2xl bg-gradient-to-r ${ROLE_THEME[role].gradient} px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none`}
            >
              {checking ? "確認中..." : "ログイン"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              {role === "shooter"
                ? "チーム内で共有しているパスワードを入力してください。"
                : "ご自身の担当クライアント用アカウントでログインしてください。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
