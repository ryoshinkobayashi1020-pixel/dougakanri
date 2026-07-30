"use client";

import { TrashIcon } from "./icons";

export function CompleteConfirmModal({
  open,
  caseTitle,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  caseTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-slate-900/5">
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <TrashIcon className="size-6" />
        </div>
        <h2 className="mb-2 text-lg font-extrabold leading-snug text-slate-900">
          完成して公開予約したら、
          <br />
          元素材をグーグルドライブから
          <br />
          削除してください
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">
          「{caseTitle}」を対応完了にします。ドライブの元素材を削除したら、下のボタンを押してください。
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-500"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
}
