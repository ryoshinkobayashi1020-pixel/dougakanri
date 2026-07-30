import { Client, ContentCase } from "./types";

const now = new Date();

function daysFromNow(days: number, hour?: number, minute?: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  if (hour !== undefined) {
    d.setHours(hour, minute ?? 0, 0, 0);
  }
  return d.toISOString();
}

export const CLIENTS: Client[] = [
  {
    name: "カフェど・れみ",
    driveUrl: "https://drive.google.com/drive/folders/example-doremi-root",
  },
  {
    name: "美容室HANA",
    driveUrl: "https://drive.google.com/drive/folders/example-hana-root",
  },
  {
    name: "整体院コアバランス",
    driveUrl: "https://drive.google.com/drive/folders/example-core-root",
  },
  {
    name: "パーソナルジムFLEX",
    driveUrl: "https://drive.google.com/drive/folders/example-flex-root",
  },
];

export const SEED_CASES: ContentCase[] = [
  {
    id: "case-1",
    clientName: "カフェど・れみ",
    title: "新作ドリンク紹介ショート",
    platforms: ["tiktok", "youtube"],
    driveUrl: "https://drive.google.com/drive/folders/example-doremi",
    referenceVideoUrl: "https://www.tiktok.com/@example/video/doremi-reference",
    editDeadline: daysFromNow(2),
    publishAt: daysFromNow(3, 18, 0),
    youtubeHashtags: "#カフェどれみ #新作ドリンク",
    tiktokHashtags: "#カフェどれみ #ドリンク紹介",
    status: "editing",
    notes: "サビの部分は明るめのBGMで。テロップは大きめ希望。",
    history: [
      { id: "h1", at: daysFromNow(-3), text: "撮影者が案件を登録し、編集チームに依頼しました。" },
      { id: "h2", at: daysFromNow(-1), text: "編集者が編集を開始しました。" },
    ],
    createdAt: daysFromNow(-3),
    updatedAt: daysFromNow(-1),
  },
  {
    id: "case-2",
    clientName: "美容室HANA",
    title: "スタイリング密着Vlog",
    platforms: ["youtube"],
    driveUrl: "https://drive.google.com/drive/folders/example-hana",
    referenceVideoUrl: "",
    editDeadline: daysFromNow(-1),
    publishAt: daysFromNow(0, 20, 0),
    youtubeHashtags: "#美容室HANA #スタイリング",
    tiktokHashtags: "",
    status: "requested",
    notes: "",
    history: [
      { id: "h1", at: daysFromNow(-2), text: "撮影者が案件を登録し、編集チームに依頼しました。" },
    ],
    createdAt: daysFromNow(-2),
    updatedAt: daysFromNow(-2),
  },
  {
    id: "case-3",
    clientName: "整体院コアバランス",
    title: "肩こり解消ストレッチ",
    platforms: ["tiktok"],
    driveUrl: "https://drive.google.com/drive/folders/example-core",
    referenceVideoUrl: "https://www.youtube.com/watch?v=example-core-reference",
    editDeadline: daysFromNow(0),
    publishAt: daysFromNow(1, 12, 0),
    youtubeHashtags: "",
    tiktokHashtags: "#整体院コアバランス #肩こり解消",
    status: "scheduled",
    notes: "投稿は明日12時予約済み。",
    history: [
      { id: "h1", at: daysFromNow(-4), text: "撮影者が案件を登録し、編集チームに依頼しました。" },
      { id: "h2", at: daysFromNow(-2), text: "編集者が編集を開始しました。" },
      { id: "h3", at: daysFromNow(-1), text: "編集者が投稿予約を完了しました。" },
    ],
    createdAt: daysFromNow(-4),
    updatedAt: daysFromNow(-1),
  },
  {
    id: "case-4",
    clientName: "パーソナルジムFLEX",
    title: "会員インタビューまとめ",
    platforms: ["youtube", "tiktok"],
    driveUrl: "https://drive.google.com/drive/folders/example-flex",
    referenceVideoUrl: "",
    editDeadline: daysFromNow(-4),
    publishAt: daysFromNow(-4, 19, 0),
    youtubeHashtags: "#パーソナルジムFLEX #会員インタビュー",
    tiktokHashtags: "#FLEX #ジム",
    status: "completed",
    notes: "元素材は削除済み。",
    history: [
      { id: "h1", at: daysFromNow(-8), text: "撮影者が案件を登録し、編集チームに依頼しました。" },
      { id: "h2", at: daysFromNow(-6), text: "編集者が編集を開始しました。" },
      { id: "h3", at: daysFromNow(-5), text: "編集者が投稿予約を完了しました。" },
      {
        id: "h4",
        at: daysFromNow(-4),
        text: "編集者が対応完了にしました。元素材はドライブから削除済みです。",
      },
    ],
    createdAt: daysFromNow(-8),
    updatedAt: daysFromNow(-4),
  },
];
