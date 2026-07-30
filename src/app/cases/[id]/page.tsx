"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PlatformBadgeGroup } from "@/components/PlatformBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { DeadlinePill } from "@/components/DeadlinePill";
import { PublishPill } from "@/components/PublishPill";
import { CompleteConfirmModal } from "@/components/CompleteConfirmModal";
import { TrashIcon } from "@/components/icons";

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    cases,
    currentUser,
    ready,
    updateCase,
    removeCase,
    setStatus,
    addHistory,
  } = useStore();
  const [editing, setEditing] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const item = useMemo(
    () => cases.find((c) => c.id === params.id),
    [cases, params.id],
  );

  const [draftDeadline, setDraftDeadline] = useState("");
  const [draftPublishAt, setDraftPublishAt] = useState("");
  const [draftDriveUrl, setDraftDriveUrl] = useState("");
  const [draftReferenceVideoUrl, setDraftReferenceVideoUrl] = useState("");
  const [draftYoutubeHashtags, setDraftYoutubeHashtags] = useState("");
  const [draftTiktokHashtags, setDraftTiktokHashtags] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  if (!ready) return null;

  if (!currentUser) {
    router.replace("/");
    return null;
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-4 text-slate-500">案件が見つかりませんでした。</p>
        <Link href="/" className="font-bold text-slate-900 underline">
          トップへ戻る
        </Link>
      </div>
    );
  }

  const isShooterRole = currentUser.role === "shooter";
  const isEditorRole = currentUser.role === "editor";

  function startEditing() {
    if (!item) return;
    setDraftDeadline(item.editDeadline.slice(0, 10));
    setDraftPublishAt(item.publishAt.slice(0, 16));
    setDraftDriveUrl(item.driveUrl);
    setDraftReferenceVideoUrl(item.referenceVideoUrl);
    setDraftYoutubeHashtags(item.youtubeHashtags);
    setDraftTiktokHashtags(item.tiktokHashtags);
    setDraftNotes(item.notes);
    setEditing(true);
  }

  function saveEdits() {
    if (!item) return;
    updateCase(item.id, {
      editDeadline: new Date(draftDeadline).toISOString(),
      publishAt: new Date(draftPublishAt).toISOString(),
      driveUrl: draftDriveUrl.trim(),
      referenceVideoUrl: draftReferenceVideoUrl.trim(),
      youtubeHashtags: draftYoutubeHashtags.trim(),
      tiktokHashtags: draftTiktokHashtags.trim(),
      notes: draftNotes.trim(),
    });
    addHistory(item.id, "撮影者が締切・公開日時・詳細を更新しました。");
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link
        href={currentUser.role === "shooter" ? "/shooter" : "/editor"}
        className="mb-4 inline-block text-sm font-bold text-slate-400 hover:text-slate-600"
      >
        ← 一覧に戻る
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.06]">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {item.clientName}
        </p>
        <h1 className="mb-3 text-xl font-extrabold tracking-tight text-slate-900">
          {item.title}
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          <PlatformBadgeGroup platforms={item.platforms} />
        </div>

        {!editing ? (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              <DeadlinePill deadline={item.editDeadline} status={item.status} />
              <PublishPill publishAt={item.publishAt} />
            </div>

            <div className="mb-4 rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="mb-1 text-xs font-bold text-slate-400">
                Googleドライブ
              </p>
              <a
                href={item.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-bold text-sky-700 underline"
              >
                {item.driveUrl}
              </a>
            </div>

            {item.referenceVideoUrl && (
              <div className="mb-4 rounded-2xl bg-violet-50 p-3 text-sm">
                <p className="mb-1 text-xs font-bold text-violet-400">
                  見本動画
                </p>
                <a
                  href={item.referenceVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-bold text-violet-700 underline"
                >
                  {item.referenceVideoUrl}
                </a>
              </div>
            )}

            {(item.youtubeHashtags || item.tiktokHashtags) && (
              <div className="mb-4 space-y-2">
                {item.youtubeHashtags && (
                  <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">
                    <p className="mb-1 text-xs font-bold text-red-400">
                      YouTubeのハッシュタグ
                    </p>
                    {item.youtubeHashtags}
                  </div>
                )}
                {item.tiktokHashtags && (
                  <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-800">
                    <p className="mb-1 text-xs font-bold text-slate-400">
                      TikTokのハッシュタグ
                    </p>
                    {item.tiktokHashtags}
                  </div>
                )}
              </div>
            )}

            {item.notes && (
              <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                <p className="mb-1 text-xs font-bold text-amber-500">メモ</p>
                {item.notes}
              </div>
            )}

            {isShooterRole && (
              <button
                onClick={startEditing}
                className="mb-2 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                締切・公開日時・詳細を編集する
              </button>
            )}

            {isShooterRole &&
              (confirmingDelete ? (
                <div className="mb-2 flex items-center gap-2 rounded-2xl bg-rose-50 p-3">
                  <p className="flex-1 text-xs font-bold text-rose-600">
                    この案件を削除しますか？元に戻せません。
                  </p>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      removeCase(item.id);
                      router.push("/shooter");
                    }}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
                  >
                    削除する
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50"
                >
                  <TrashIcon className="size-3.5" />
                  この案件を削除する
                </button>
              ))}
          </>
        ) : (
          <div className="mb-4 space-y-3 rounded-2xl border border-slate-200 p-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">
                編集の締切
              </label>
              <input
                type="date"
                value={draftDeadline}
                onChange={(e) => setDraftDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">
                公開日時
              </label>
              <input
                type="datetime-local"
                value={draftPublishAt}
                onChange={(e) => setDraftPublishAt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">
                ドライブリンク
              </label>
              <input
                value={draftDriveUrl}
                onChange={(e) => setDraftDriveUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">
                見本動画のリンク
              </label>
              <input
                value={draftReferenceVideoUrl}
                onChange={(e) => setDraftReferenceVideoUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            {item.platforms.includes("youtube") && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">
                  YouTubeのハッシュタグ
                </label>
                <input
                  value={draftYoutubeHashtags}
                  onChange={(e) => setDraftYoutubeHashtags(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
              </div>
            )}
            {item.platforms.includes("tiktok") && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">
                  TikTokのハッシュタグ
                </label>
                <input
                  value={draftTiktokHashtags}
                  onChange={(e) => setDraftTiktokHashtags(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">
                メモ
              </label>
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600"
              >
                キャンセル
              </button>
              <button
                onClick={saveEdits}
                className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white"
              >
                保存
              </button>
            </div>
          </div>
        )}

        {isEditorRole && item.status !== "completed" && (
          <div className="mb-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {item.status === "requested" && (
              <button
                onClick={() =>
                  setStatus(item.id, "editing", "編集者が作業を開始しました。")
                }
                className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700"
              >
                作業を始める
              </button>
            )}
            {item.status === "editing" && (
              <button
                onClick={() =>
                  setStatus(
                    item.id,
                    "scheduled",
                    "編集者が投稿予約を完了しました。",
                  )
                }
                className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"
              >
                投稿予約した
              </button>
            )}
            {item.status === "scheduled" && (
              <button
                onClick={() => setShowComplete(true)}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                公開済みにする
              </button>
            )}
          </div>
        )}

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-bold text-slate-400">やりとり履歴</p>
          <ul className="space-y-2">
            {[...item.history].reverse().map((h) => (
              <li key={h.id} className="text-xs text-slate-500">
                <span className="font-bold text-slate-400">
                  {new Date(h.at).toLocaleString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>{" "}
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CompleteConfirmModal
        open={showComplete}
        caseTitle={item.title}
        onCancel={() => setShowComplete(false)}
        onConfirm={() => {
          setStatus(
            item.id,
            "completed",
            "編集者が公開済みにしました。元素材はドライブから削除済みです。",
          );
          setShowComplete(false);
        }}
      />
    </div>
  );
}
