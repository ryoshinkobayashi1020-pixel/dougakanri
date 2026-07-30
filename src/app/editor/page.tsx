"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { CaseCard } from "@/components/CaseCard";
import { CompleteConfirmModal } from "@/components/CompleteConfirmModal";
import { CaseStatus, ContentCase, STATUS_LABEL } from "@/lib/types";
import { FolderIcon } from "@/components/icons";

const BOARD_STATUSES: CaseStatus[] = ["requested", "editing", "scheduled"];

const COLUMN_HINT: Record<CaseStatus, string> = {
  requested: "撮影者から依頼が届いています",
  editing: "編集を進めましょう",
  scheduled: "投稿予約が完了しています",
  completed: "公開ずみ",
};

const COLUMN_ACCENT: Record<CaseStatus, string> = {
  requested: "bg-amber-400",
  editing: "bg-sky-400",
  scheduled: "bg-violet-400",
  completed: "bg-emerald-400",
};

const ACTION_STYLE: Record<string, string> = {
  sky: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/20",
  violet: "bg-violet-600 hover:bg-violet-500 shadow-violet-600/20",
  emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20",
};

export default function EditorPage() {
  const { currentUser, ready } = useRequireRole("editor");
  const { cases, setStatus } = useStore();
  const [completingId, setCompletingId] = useState<string | null>(null);

  const columns = useMemo(() => {
    const grouped: Record<CaseStatus, ContentCase[]> = {
      requested: [],
      editing: [],
      scheduled: [],
      completed: [],
    };
    for (const c of cases) grouped[c.status].push(c);
    for (const status of BOARD_STATUSES) {
      grouped[status].sort(
        (a, b) =>
          new Date(a.editDeadline).getTime() - new Date(b.editDeadline).getTime(),
      );
    }
    return grouped;
  }, [cases]);

  if (!ready || !currentUser) return null;

  const completingCase = cases.find((c) => c.id === completingId) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          編集ボード
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          締切が近い案件から順に並んでいます。全クライアントの案件をここで管理できます。
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {BOARD_STATUSES.map((status) => (
          <div key={status} className="min-w-0">
            <div className="mb-3 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
              <div className={`h-1 ${COLUMN_ACCENT[status]}`} />
              <div className="px-3.5 py-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-800">
                    {STATUS_LABEL[status]}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                    {columns[status].length}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {COLUMN_HINT[status]}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {columns[status].length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-5 text-center text-xs text-slate-300">
                  案件なし
                </div>
              )}

              {columns[status].map((item) => (
                <CaseCard
                  key={item.id}
                  item={item}
                  footer={
                    <div className="flex flex-col gap-2">
                      <a
                        href={item.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                      >
                        <FolderIcon className="size-3.5" />
                        ドライブを開く
                      </a>

                      {status === "requested" && (
                        <button
                          onClick={() =>
                            setStatus(item.id, "editing", "編集者が作業を開始しました。")
                          }
                          className={`rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition ${ACTION_STYLE.sky}`}
                        >
                          作業を始める
                        </button>
                      )}

                      {status === "editing" && (
                        <button
                          onClick={() =>
                            setStatus(
                              item.id,
                              "scheduled",
                              "編集者が投稿予約を完了しました。",
                            )
                          }
                          className={`rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition ${ACTION_STYLE.violet}`}
                        >
                          投稿予約した
                        </button>
                      )}

                      {status === "scheduled" && (
                        <button
                          onClick={() => setCompletingId(item.id)}
                          className={`rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition ${ACTION_STYLE.emerald}`}
                        >
                          公開済みにする
                        </button>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <CompleteConfirmModal
        open={!!completingCase}
        caseTitle={completingCase?.title ?? ""}
        onCancel={() => setCompletingId(null)}
        onConfirm={() => {
          if (!completingCase) return;
          setStatus(
            completingCase.id,
            "completed",
            "編集者が公開済みにしました。元素材はドライブから削除済みです。",
          );
          setCompletingId(null);
        }}
      />
    </div>
  );
}
