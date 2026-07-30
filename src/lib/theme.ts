import { Role } from "./types";

export const ROLE_THEME: Record<
  Role,
  {
    label: string;
    appName: string;
    tagline: string;
    gradient: string;
    ring: string;
    text: string;
    softBg: string;
    solidBg: string;
    solidBgHover: string;
  }
> = {
  shooter: {
    label: "撮影者",
    appName: "撮影者ワークスペース",
    tagline: "案件を依頼して、進み具合を見守る",
    gradient: "from-indigo-600 to-blue-500",
    ring: "ring-indigo-500/20",
    text: "text-indigo-700",
    softBg: "bg-indigo-50",
    solidBg: "bg-indigo-600",
    solidBgHover: "hover:bg-indigo-500",
  },
  editor: {
    label: "編集者",
    appName: "編集者ワークボード",
    tagline: "担当案件を編集して、公開まで仕上げる",
    gradient: "from-violet-600 to-fuchsia-500",
    ring: "ring-violet-500/20",
    text: "text-violet-700",
    softBg: "bg-violet-50",
    solidBg: "bg-violet-600",
    solidBgHover: "hover:bg-violet-500",
  },
};
