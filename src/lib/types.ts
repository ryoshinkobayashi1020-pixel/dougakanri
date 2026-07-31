export type Platform = "youtube" | "tiktok";

export type CaseStatus = "requested" | "editing" | "scheduled" | "completed";

export type Role = "shooter" | "editor";

export interface CurrentUser {
  role: Role;
  email?: string;
}

export interface HistoryEntry {
  id: string;
  at: string;
  text: string;
}

export interface Client {
  name: string;
  driveUrl: string;
  editorEmail: string;
}

export interface ContentCase {
  id: string;
  clientName: string;
  title: string;
  platforms: Platform[];
  driveUrl: string;
  referenceVideoUrl: string;
  editDeadline: string;
  publishAt: string;
  youtubeHashtags: string;
  tiktokHashtags: string;
  status: CaseStatus;
  notes: string;
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_ORDER: CaseStatus[] = [
  "requested",
  "editing",
  "scheduled",
  "completed",
];

export const STATUS_LABEL: Record<CaseStatus, string> = {
  requested: "未作業",
  editing: "作業中",
  scheduled: "公開予約済み",
  completed: "公開",
};
