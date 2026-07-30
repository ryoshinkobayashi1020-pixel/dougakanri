"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useRequireRole } from "@/lib/useRequireRole";
import { CaseCard } from "@/components/CaseCard";
import { StatusBadge } from "@/components/StatusBadge";
import { NewCaseForm } from "@/components/NewCaseForm";
import { CalendarModal } from "@/components/CalendarModal";
import { TimeScheduleModal } from "@/components/TimeScheduleModal";
import { ClientManagerModal } from "@/components/ClientManagerModal";
import { ROLE_THEME } from "@/lib/theme";
import { dateKey, isoDateKey } from "@/lib/date";

export default function ShooterPage() {
  const { currentUser, ready } = useRequireRole("shooter");
  const { cases, addCase } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const theme = ROLE_THEME.shooter;

  const activeCases = useMemo(
    () =>
      cases.filter((c) => c.status === "requested" || c.status === "editing"),
    [cases],
  );

  const sortedCases = useMemo(
    () =>
      [...activeCases].sort(
        (a, b) =>
          new Date(a.editDeadline).getTime() - new Date(b.editDeadline).getTime(),
      ),
    [activeCases],
  );

  const selectedDateCases = useMemo(() => {
    if (!selectedDate) return [];
    return cases.filter((c) => isoDateKey(c.publishAt) === dateKey(selectedDate));
  }, [cases, selectedDate]);

  if (!ready || !currentUser) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            案件一覧
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            編集をお願いした案件と進み具合を確認できます
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowClients(true)}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            クライアント管理
          </button>
          <button
            onClick={() => setShowCalendar(true)}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            タイムスケジュールを見る
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={`rounded-full bg-gradient-to-r ${theme.gradient} px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:opacity-90`}
          >
            ＋ 新規案件を依頼する
          </button>
        </div>
      </div>

      {sortedCases.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-sm text-slate-400">
          まだ案件がありません。「＋ 新規案件を依頼する」から依頼してみましょう。
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedCases.map((c) => (
            <CaseCard
              key={c.id}
              item={c}
              footer={<StatusBadge status={c.status} />}
            />
          ))}
        </div>
      )}

      {showForm && (
        <NewCaseForm
          onCancel={() => setShowForm(false)}
          onCreate={(input) => {
            addCase(input);
            setShowForm(false);
          }}
        />
      )}

      <CalendarModal
        open={showCalendar}
        cases={cases}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setShowCalendar(false);
        }}
        onClose={() => setShowCalendar(false)}
      />

      <TimeScheduleModal
        open={!!selectedDate}
        cases={selectedDateCases}
        date={selectedDate}
        onBack={() => {
          setSelectedDate(null);
          setShowCalendar(true);
        }}
        onClose={() => setSelectedDate(null)}
      />

      <ClientManagerModal open={showClients} onClose={() => setShowClients(false)} />
    </div>
  );
}
