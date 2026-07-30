import Link from "next/link";
import { ContentCase } from "@/lib/types";
import { PlatformBadgeGroup } from "./PlatformBadge";
import { DeadlinePill } from "./DeadlinePill";
import { PublishPill } from "./PublishPill";

export function CaseCard({
  item,
  footer,
}: {
  item: ContentCase;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.06] transition hover:shadow-[0_4px_16px_-4px_rgba(15,23,42,0.12)]">
      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {item.clientName}
        </p>
        <Link
          href={`/cases/${item.id}`}
          className="text-[15px] font-extrabold text-slate-900 hover:text-slate-600"
        >
          {item.title}
        </Link>
      </div>

      <div className="mb-3.5">
        <PlatformBadgeGroup platforms={item.platforms} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <DeadlinePill deadline={item.editDeadline} status={item.status} />
        <PublishPill publishAt={item.publishAt} />
      </div>

      {footer}
    </div>
  );
}
