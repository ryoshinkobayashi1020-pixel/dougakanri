import { CaseStatus, STATUS_LABEL } from "@/lib/types";

const STYLES: Record<CaseStatus, string> = {
  requested: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  editing: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  scheduled: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

const DOT: Record<CaseStatus, string> = {
  requested: "bg-amber-500",
  editing: "bg-sky-500",
  scheduled: "bg-violet-500",
  completed: "bg-emerald-500",
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${STYLES[status]}`}
    >
      <span className={`size-1.5 rounded-full ${DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
