"use client";

import { useMemo, useState } from "react";
import { ContentCase } from "@/lib/types";
import { dateKey, formatMonthTitle, isoDateKey } from "@/lib/date";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function CalendarModal({
  open,
  cases,
  onSelectDate,
  onClose,
}: {
  open: boolean;
  cases: ContentCase[];
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const casesByDate = useMemo(() => {
    const map = new Map<string, ContentCase[]>();
    for (const c of cases) {
      const key = isoDateKey(c.publishAt);
      const list = map.get(key) ?? [];
      list.push(c);
      map.set(key, list);
    }
    return map;
  }, [cases]);

  if (!open) return null;

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              公開カレンダー
            </h2>
            <p className="text-xs text-slate-500">
              日付を選ぶと、その日のタイムスケジュールが開きます
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200"
          >
            閉じる
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
            className="rounded-full px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            ← 前月
          </button>
          <p className="text-sm font-extrabold text-slate-800">
            {formatMonthTitle(monthCursor)}
          </p>
          <button
            onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
            className="rounded-full px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            翌月 →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="h-20" />;
            const items = casesByDate.get(dateKey(date)) ?? [];
            const isToday = dateKey(date) === dateKey(today);
            return (
              <button
                key={i}
                onClick={() => onSelectDate(date)}
                className={`h-20 rounded-xl border p-1.5 text-left transition hover:border-slate-300 hover:bg-slate-50 ${
                  isToday ? "border-indigo-300 bg-indigo-50/50" : "border-slate-100"
                }`}
              >
                <p
                  className={`mb-1 text-xs font-bold ${
                    isToday ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {date.getDate()}
                </p>
                <div className="space-y-0.5">
                  {items.slice(0, 2).map((c) => (
                    <p
                      key={c.id}
                      className="truncate rounded bg-violet-100 px-1 py-0.5 text-[10px] font-bold text-violet-700"
                    >
                      {c.title}
                    </p>
                  ))}
                  {items.length > 2 && (
                    <p className="text-[10px] font-bold text-slate-400">
                      +{items.length - 2}件
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
