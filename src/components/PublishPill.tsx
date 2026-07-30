import { formatPublishAt } from "@/lib/date";
import { CalendarIcon } from "./icons";

export function PublishPill({ publishAt }: { publishAt: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700 ring-1 ring-inset ring-violet-600/20">
      <CalendarIcon className="size-3" />
      公開 {formatPublishAt(publishAt)}
    </span>
  );
}
