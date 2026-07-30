"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Platform } from "@/lib/types";

const NEW_CLIENT_VALUE = "__new__";

export function NewCaseForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (input: {
    clientName: string;
    title: string;
    platforms: Platform[];
    driveUrl: string;
    referenceVideoUrl: string;
    editDeadline: string;
    publishAt: string;
    youtubeHashtags: string;
    tiktokHashtags: string;
    notes: string;
  }) => void;
}) {
  const { clients, addClient } = useStore();
  const [clientChoice, setClientChoice] = useState(
    clients[0]?.name ?? NEW_CLIENT_VALUE,
  );
  const [newClientName, setNewClientName] = useState("");
  const [newClientDriveUrl, setNewClientDriveUrl] = useState("");
  const [title, setTitle] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [driveUrl, setDriveUrl] = useState("");
  const [referenceVideoUrl, setReferenceVideoUrl] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [youtubeHashtags, setYoutubeHashtags] = useState("");
  const [tiktokHashtags, setTiktokHashtags] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function handleSubmit() {
    const clientName =
      clientChoice === NEW_CLIENT_VALUE ? newClientName.trim() : clientChoice;

    if (
      !clientName ||
      !title.trim() ||
      !driveUrl.trim() ||
      !editDeadline ||
      !publishAt
    ) {
      setError(
        "クライアント名・動画名・ドライブリンク・締切・公開日時は必須です。",
      );
      return;
    }
    if (platforms.length === 0) {
      setError("投稿先プラットフォームを1つ以上選んでください。");
      return;
    }

    if (clientChoice === NEW_CLIENT_VALUE) {
      addClient(clientName, newClientDriveUrl);
    }

    onCreate({
      clientName,
      title: title.trim(),
      platforms,
      driveUrl: driveUrl.trim(),
      referenceVideoUrl: referenceVideoUrl.trim(),
      editDeadline: new Date(editDeadline).toISOString(),
      publishAt: new Date(publishAt).toISOString(),
      youtubeHashtags: youtubeHashtags.trim(),
      tiktokHashtags: tiktokHashtags.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">
          新しい案件を依頼する
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              クライアント名
            </label>
            <select
              value={clientChoice}
              onChange={(e) => setClientChoice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            >
              {clients.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value={NEW_CLIENT_VALUE}>＋ 新しいクライアントを登録</option>
            </select>
            {clientChoice === NEW_CLIENT_VALUE ? (
              <div className="mt-2 space-y-2">
                <input
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="例：カフェど・れみ"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />
                <input
                  value={newClientDriveUrl}
                  onChange={(e) => setNewClientDriveUrl(e.target.value)}
                  placeholder="このクライアント専用のGoogleドライブフォルダURL"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                />
              </div>
            ) : (
              (() => {
                const selected = clients.find((c) => c.name === clientChoice);
                return selected?.driveUrl ? (
                  <a
                    href={selected.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-bold text-sky-700 underline"
                  >
                    📁 {selected.name}のドライブフォルダを開く
                  </a>
                ) : null;
              })()
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              動画名
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：新作ドリンク紹介ショート"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              投稿先
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => togglePlatform("youtube")}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${
                  platforms.includes("youtube")
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                YouTube
              </button>
              <button
                type="button"
                onClick={() => togglePlatform("tiktok")}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${
                  platforms.includes("tiktok")
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                TikTok
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                YouTubeのハッシュタグ
              </label>
              <input
                value={youtubeHashtags}
                onChange={(e) => setYoutubeHashtags(e.target.value)}
                placeholder="#カフェどれみ #新作ドリンク"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                TikTokのハッシュタグ
              </label>
              <input
                value={tiktokHashtags}
                onChange={(e) => setTiktokHashtags(e.target.value)}
                placeholder="#カフェどれみ #ドリンク紹介"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              Googleドライブのリンク
            </label>
            <input
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              見本動画のリンク（任意）
            </label>
            <input
              value={referenceVideoUrl}
              onChange={(e) => setReferenceVideoUrl(e.target.value)}
              placeholder="こんな雰囲気にしたい、という参考動画のURL"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              編集の締切
            </label>
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              公開日時
            </label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">
              メモ（任意）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="BGMの雰囲気やテロップの希望など"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            この内容で依頼する
          </button>
        </div>
      </div>
    </div>
  );
}
