"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { FolderIcon, TrashIcon } from "./icons";

export function ClientManagerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { clients, cases, addClient, updateClientDriveUrl, removeClient } =
    useStore();
  const [newName, setNewName] = useState("");
  const [newDriveUrl, setNewDriveUrl] = useState("");
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [editingDriveFor, setEditingDriveFor] = useState<string | null>(null);
  const [draftDriveUrl, setDraftDriveUrl] = useState("");

  if (!open) return null;

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (clients.some((c) => c.name === trimmed)) {
      setError("そのクライアント名はすでに登録されています。");
      return;
    }
    addClient(trimmed, newDriveUrl);
    setNewName("");
    setNewDriveUrl("");
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              クライアント管理
            </h2>
            <p className="text-xs text-slate-500">
              登録したクライアントは案件依頼時にプルダウンで選べます
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200"
          >
            閉じる
          </button>
        </div>

        <div className="mb-4 space-y-2 rounded-2xl border border-slate-200 p-3">
          <input
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
            placeholder="新しいクライアント名"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
          <input
            value={newDriveUrl}
            onChange={(e) => setNewDriveUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="専用Googleドライブフォルダのリンク（任意）"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
          <button
            onClick={handleAdd}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            ＋ クライアントを登録
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
            {error}
          </p>
        )}

        <ul className="space-y-1.5">
          {clients.map((c) => {
            const count = cases.filter((x) => x.clientName === c.name).length;
            const confirming = confirmingDelete === c.name;
            const editingDrive = editingDriveFor === c.name;
            return (
              <li
                key={c.name}
                className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{count}件の案件</span>
                    {confirming ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            removeClient(c.name);
                            setConfirmingDelete(null);
                          }}
                          className="rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-rose-500"
                        >
                          削除する
                        </button>
                        <button
                          onClick={() => setConfirmingDelete(null)}
                          className="rounded-lg px-2 py-1 text-[11px] font-bold text-slate-400 hover:bg-slate-200"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingDelete(c.name)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`${c.name}を削除`}
                      >
                        <TrashIcon className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-1.5">
                  {editingDrive ? (
                    <div className="flex gap-1.5">
                      <input
                        autoFocus
                        value={draftDriveUrl}
                        onChange={(e) => setDraftDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-slate-900"
                      />
                      <button
                        onClick={() => {
                          updateClientDriveUrl(c.name, draftDriveUrl);
                          setEditingDriveFor(null);
                        }}
                        className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white"
                      >
                        保存
                      </button>
                    </div>
                  ) : c.driveUrl ? (
                    <button
                      onClick={() => {
                        setEditingDriveFor(c.name);
                        setDraftDriveUrl(c.driveUrl);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
                    >
                      <FolderIcon className="size-3" />
                      ドライブフォルダを編集
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingDriveFor(c.name);
                        setDraftDriveUrl("");
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ＋ ドライブフォルダを設定
                    </button>
                  )}
                </div>
              </li>
            );
          })}
          {clients.length === 0 && (
            <li className="py-6 text-center text-sm text-slate-400">
              まだクライアントが登録されていません。
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
