"use client";

import Link from "next/link";
import { ContentCase } from "@/lib/types";
import { formatDayTitle, formatPublishTime } from "@/lib/date";

const AXIS_START = 6;
const AXIS_END = 24;
const HOURS = Array.from(
  { length: AXIS_END - AXIS_START + 1 },
  (_, i) => AXIS_START + i,
);

const BANDS = [
  { label: "朝", from: 6, to: 9 },
  { label: "昼", from: 9, to: 15 },
  { label: "夕", from: 15, to: 18 },
  { label: "夜", from: 18, to: 21 },
  { label: "深夜", from: 21, to: 24 },
];

const PLATFORM_COLOR: Record<string, string> = {
  youtube: "bg-red-500",
  tiktok: "bg-slate-900",
};

function positionPercent(iso: string): number {
  const d = new Date(iso);
  const hourFloat = d.getHours() + d.getMinutes() / 60;
  const clamped = Math.min(Math.max(hourFloat, AXIS_START), AXIS_END);
  return ((clamped - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
}

export function TimeScheduleModal({
  open,
  cases,
  date,
  onBack,
  onClose,
}: {
  open: boolean;
  cases: ContentCase[];
  date?: Date | null;
  onBack?: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const clientNames = Array.from(new Set(cases.map((c) => c.clientName))).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="mb-1 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ← カレンダーに戻る
              </button>
            )}
            <h2 className="text-lg font-extrabold text-slate-900">
              {date ? `${formatDayTitle(date)}の公開スケジュール` : "公開タイムスケジュール"}
            </h2>
            <p className="text-xs text-slate-500">
              クライアントごとに、いつ動画が公開されるかを一覧で確認できます
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200"
          >
            閉じる
          </button>
        </div>

        <div className="min-w-[720px]">
          <div className="mb-1 flex pl-32">
            {BANDS.map((b) => (
              <div
                key={b.label}
                style={{ width: `${((b.to - b.from) / (AXIS_END - AXIS_START)) * 100}%` }}
                className="text-center text-xs font-bold text-slate-400"
              >
                {b.label}
              </div>
            ))}
          </div>

          <div className="relative mb-2 h-6 pl-32">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ left: `${((h - AXIS_START) / (AXIS_END - AXIS_START)) * 100}%` }}
                className="absolute -translate-x-1/2 text-[10px] font-bold text-slate-300"
              >
                {h}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {clientNames.map((client) => {
              const items = cases.filter((c) => c.clientName === client);
              return (
                <div key={client} className="flex items-center">
                  <div className="w-32 shrink-0 truncate pr-2 text-xs font-bold text-slate-600">
                    {client}
                  </div>
                  <div className="relative h-11 flex-1 rounded-lg bg-slate-50">
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{
                          left: `${((h - AXIS_START) / (AXIS_END - AXIS_START)) * 100}%`,
                        }}
                        className="absolute top-0 h-full w-px bg-slate-200"
                      />
                    ))}
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/cases/${item.id}`}
                        style={{ left: `${positionPercent(item.publishAt)}%` }}
                        className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm transition hover:brightness-110 ${
                          PLATFORM_COLOR[item.platforms[0]] ?? "bg-violet-600"
                        }`}
                      >
                        {formatPublishTime(item.publishAt)}　{item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            {clientNames.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                まだ案件がありません。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
