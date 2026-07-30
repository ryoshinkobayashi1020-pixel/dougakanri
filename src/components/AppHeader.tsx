"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ROLE_THEME } from "@/lib/theme";
import { ClapperIcon } from "./icons";

export function AppHeader() {
  const { currentUser, setCurrentUser, ready } = useStore();
  const router = useRouter();

  if (!ready || !currentUser) return null;

  const theme = ROLE_THEME[currentUser.role];
  const homeHref = currentUser.role === "shooter" ? "/shooter" : "/editor";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href={homeHref} className="flex items-center gap-2.5">
          <span
            className={`flex size-8 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-sm`}
          >
            <ClapperIcon className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-extrabold tracking-tight text-slate-900">
              {theme.appName}
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              {theme.tagline}
            </p>
          </div>
        </Link>

        <button
          onClick={() => {
            setCurrentUser(null);
            router.push("/");
          }}
          className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-slate-300"
        >
          <span
            className={`flex size-7 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white`}
          >
            <ClapperIcon className="size-3.5" />
          </span>
          <span className="text-left">
            <span className="block text-xs font-bold text-slate-700">
              {theme.label}としてログイン中
            </span>
          </span>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-500">
            ログアウト
          </span>
        </button>
      </div>
    </header>
  );
}
