import { Platform } from "@/lib/types";

const STYLES: Record<Platform, { label: string; className: string }> = {
  youtube: {
    label: "YouTube",
    className: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20",
  },
  tiktok: {
    label: "TikTok",
    className: "bg-slate-900 text-white ring-1 ring-inset ring-slate-900",
  },
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  const style = STYLES[platform];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-tight ${style.className}`}
    >
      {style.label}
    </span>
  );
}

export function PlatformBadgeGroup({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {platforms.map((p) => (
        <PlatformBadge key={p} platform={p} />
      ))}
    </div>
  );
}
