export function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function isOverdue(iso: string, status: string): boolean {
  if (status === "completed") return false;
  return daysUntil(iso) < 0;
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatPublishAt(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timePart = d.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}〜`;
}

export function formatPublishTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isoDateKey(iso: string): string {
  return dateKey(new Date(iso));
}

export function formatMonthTitle(d: Date): string {
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
}

export function formatDayTitle(d: Date): string {
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}
