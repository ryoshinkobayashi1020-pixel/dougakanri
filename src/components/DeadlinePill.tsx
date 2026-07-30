import { daysUntil, formatDeadline, isOverdue } from "@/lib/date";
import { CaseStatus } from "@/lib/types";
import { CalendarIcon } from "./icons";

export function DeadlinePill({
  deadline,
  status,
}: {
  deadline: string;
  status: CaseStatus;
}) {
  const overdue = isOverdue(deadline, status);
  const days = daysUntil(deadline);

  let note = `あと${days}日`;
  if (status === "completed") note = "公開済み";
  else if (overdue) note = `期限切れ ${Math.abs(days)}日超過`;
  else if (days === 0) note = "今日まで";

  const tone =
    status === "completed"
      ? "bg-slate-50 text-slate-400 ring-slate-200"
      : overdue
        ? "bg-rose-50 text-rose-600 ring-rose-600/20"
        : days <= 1
          ? "bg-orange-50 text-orange-600 ring-orange-600/20"
          : "bg-slate-50 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${tone}`}
    >
      <CalendarIcon className="size-3" />
      締切 {formatDeadline(deadline)}・{note}
    </span>
  );
}
