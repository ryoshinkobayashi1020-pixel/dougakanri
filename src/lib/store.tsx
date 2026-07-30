"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CaseStatus, Client, ContentCase, CurrentUser } from "./types";
import { CLIENTS, SEED_CASES } from "./seed";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const CASES_KEY = "sns-ops:cases:v2";
const USER_KEY = "sns-ops:current-user";
const CLIENTS_KEY = "sns-ops:clients:v2";

function isValidCase(c: unknown): c is ContentCase {
  if (!c || typeof c !== "object") return false;
  const r = c as Record<string, unknown>;
  return typeof r.editDeadline === "string" && typeof r.publishAt === "string";
}

function loadLocalCases(): ContentCase[] {
  if (typeof window === "undefined") return SEED_CASES;
  const raw = window.localStorage.getItem(CASES_KEY);
  if (!raw) return SEED_CASES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(isValidCase)) return SEED_CASES;
    return parsed;
  } catch {
    return SEED_CASES;
  }
}

function loadUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

function isValidClient(c: unknown): c is Client {
  if (!c || typeof c !== "object") return false;
  const r = c as Record<string, unknown>;
  return typeof r.name === "string" && typeof r.driveUrl === "string";
}

function loadLocalClients(): Client[] {
  if (typeof window === "undefined") return CLIENTS;
  const raw = window.localStorage.getItem(CLIENTS_KEY);
  if (!raw) return CLIENTS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(isValidClient)) return CLIENTS;
    return parsed;
  } catch {
    return CLIENTS;
  }
}

interface CaseRow {
  id: string;
  client_name: string;
  title: string;
  platforms: string[];
  drive_url: string;
  reference_video_url: string;
  edit_deadline: string;
  publish_at: string;
  youtube_hashtags: string;
  tiktok_hashtags: string;
  status: CaseStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  case_history: { id: string; at: string; text: string }[] | null;
}

function rowToCase(row: CaseRow): ContentCase {
  return {
    id: row.id,
    clientName: row.client_name,
    title: row.title,
    platforms: row.platforms as ContentCase["platforms"],
    driveUrl: row.drive_url,
    referenceVideoUrl: row.reference_video_url,
    editDeadline: row.edit_deadline,
    publishAt: row.publish_at,
    youtubeHashtags: row.youtube_hashtags,
    tiktokHashtags: row.tiktok_hashtags,
    status: row.status,
    notes: row.notes,
    history: (row.case_history ?? []).map((h) => ({
      id: h.id,
      at: h.at,
      text: h.text,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const CASE_SELECT = "*, case_history(id, at, text)";

async function fetchCasesFromSupabase(): Promise<ContentCase[]> {
  const { data, error } = await supabase
    .from("cases")
    .select(CASE_SELECT)
    .order("created_at", { ascending: false })
    .order("at", { foreignTable: "case_history", ascending: true });
  if (error) {
    console.error("fetchCases failed", error);
    return [];
  }
  return ((data as unknown as CaseRow[]) ?? []).map(rowToCase);
}

async function fetchClientsFromSupabase(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("name, drive_url")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("fetchClients failed", error);
    return [];
  }
  return (data ?? []).map((c) => ({ name: c.name, driveUrl: c.drive_url }));
}

interface StoreValue {
  cases: ContentCase[];
  clients: Client[];
  currentUser: CurrentUser | null;
  ready: boolean;
  setCurrentUser: (user: CurrentUser | null) => void;
  addClient: (name: string, driveUrl?: string) => void;
  updateClientDriveUrl: (name: string, driveUrl: string) => void;
  removeClient: (name: string) => void;
  addCase: (
    input: Omit<
      ContentCase,
      "id" | "status" | "history" | "createdAt" | "updatedAt"
    >,
  ) => void;
  updateCase: (id: string, patch: Partial<ContentCase>) => void;
  removeCase: (id: string) => void;
  setStatus: (id: string, status: CaseStatus, historyText: string) => void;
  addHistory: (id: string, text: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<ContentCase[]>(
    isSupabaseConfigured ? [] : SEED_CASES,
  );
  const [clients, setClients] = useState<Client[]>(
    isSupabaseConfigured ? [] : CLIENTS,
  );
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(
    null,
  );
  const [ready, setReady] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshFromSupabase = useCallback(async () => {
    const [nextCases, nextClients] = await Promise.all([
      fetchCasesFromSupabase(),
      fetchClientsFromSupabase(),
    ]);
    setCases(nextCases);
    setClients(nextClients);
  }, []);

  useEffect(() => {
    setCurrentUserState(loadUser());

    if (!isSupabaseConfigured) {
      setCases(loadLocalCases());
      setClients(loadLocalClients());
      setReady(true);
      return;
    }

    refreshFromSupabase().finally(() => setReady(true));

    function scheduleRefresh() {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(refreshFromSupabase, 300);
    }

    const channel = supabase
      .channel("sns-ops-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cases" },
        scheduleRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "case_history" },
        scheduleRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        scheduleRefresh,
      )
      .subscribe();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase]);

  useEffect(() => {
    if (!ready || isSupabaseConfigured) return;
    window.localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  }, [cases, ready]);

  useEffect(() => {
    if (!ready || isSupabaseConfigured) return;
    window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  }, [clients, ready]);

  const setCurrentUser = useCallback((user: CurrentUser | null) => {
    setCurrentUserState(user);
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, []);

  const addClient = useCallback(
    async (name: string, driveUrl = "") => {
      const trimmed = name.trim();
      if (!trimmed) return;

      if (!isSupabaseConfigured) {
        setClients((prev) =>
          prev.some((c) => c.name === trimmed)
            ? prev
            : [...prev, { name: trimmed, driveUrl: driveUrl.trim() }],
        );
        return;
      }

      const { error } = await supabase
        .from("clients")
        .insert({ name: trimmed, drive_url: driveUrl.trim() });
      if (error && error.code !== "23505") {
        console.error("addClient failed", error);
        return;
      }
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const updateClientDriveUrl = useCallback(
    async (name: string, driveUrl: string) => {
      if (!isSupabaseConfigured) {
        setClients((prev) =>
          prev.map((c) =>
            c.name === name ? { ...c, driveUrl: driveUrl.trim() } : c,
          ),
        );
        return;
      }

      const { error } = await supabase
        .from("clients")
        .update({ drive_url: driveUrl.trim() })
        .eq("name", name);
      if (error) {
        console.error("updateClientDriveUrl failed", error);
        return;
      }
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const removeClient = useCallback(
    async (name: string) => {
      if (!isSupabaseConfigured) {
        setClients((prev) => prev.filter((c) => c.name !== name));
        return;
      }

      const { error } = await supabase.from("clients").delete().eq("name", name);
      if (error) {
        console.error("removeClient failed", error);
        return;
      }
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const addCase: StoreValue["addCase"] = useCallback(
    async (input) => {
      const nowIso = new Date().toISOString();

      if (!isSupabaseConfigured) {
        const newCase: ContentCase = {
          ...input,
          id: `case-${Date.now()}`,
          status: "requested",
          history: [
            {
              id: `h-${Date.now()}`,
              at: nowIso,
              text: "撮影者が案件を登録し、編集チームに依頼しました。",
            },
          ],
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        setCases((prev) => [newCase, ...prev]);
        return;
      }

      const { data, error } = await supabase
        .from("cases")
        .insert({
          client_name: input.clientName,
          title: input.title,
          platforms: input.platforms,
          drive_url: input.driveUrl,
          reference_video_url: input.referenceVideoUrl,
          edit_deadline: input.editDeadline,
          publish_at: input.publishAt,
          youtube_hashtags: input.youtubeHashtags,
          tiktok_hashtags: input.tiktokHashtags,
          notes: input.notes,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("addCase failed", error);
        return;
      }

      await supabase.from("case_history").insert({
        case_id: data.id,
        text: "撮影者が案件を登録し、編集チームに依頼しました。",
      });

      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const updateCase: StoreValue["updateCase"] = useCallback(
    async (id, patch) => {
      if (!isSupabaseConfigured) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, ...patch, updatedAt: new Date().toISOString() }
              : c,
          ),
        );
        return;
      }

      const row: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (patch.clientName !== undefined) row.client_name = patch.clientName;
      if (patch.title !== undefined) row.title = patch.title;
      if (patch.platforms !== undefined) row.platforms = patch.platforms;
      if (patch.driveUrl !== undefined) row.drive_url = patch.driveUrl;
      if (patch.referenceVideoUrl !== undefined)
        row.reference_video_url = patch.referenceVideoUrl;
      if (patch.editDeadline !== undefined) row.edit_deadline = patch.editDeadline;
      if (patch.publishAt !== undefined) row.publish_at = patch.publishAt;
      if (patch.youtubeHashtags !== undefined)
        row.youtube_hashtags = patch.youtubeHashtags;
      if (patch.tiktokHashtags !== undefined)
        row.tiktok_hashtags = patch.tiktokHashtags;
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.notes !== undefined) row.notes = patch.notes;

      const { error } = await supabase.from("cases").update(row).eq("id", id);
      if (error) {
        console.error("updateCase failed", error);
        return;
      }
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const removeCase: StoreValue["removeCase"] = useCallback(
    async (id) => {
      if (!isSupabaseConfigured) {
        setCases((prev) => prev.filter((c) => c.id !== id));
        return;
      }

      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) {
        console.error("removeCase failed", error);
        return;
      }
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const addHistory: StoreValue["addHistory"] = useCallback(
    async (id, text) => {
      if (!isSupabaseConfigured) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...c.history,
                    { id: `h-${Date.now()}`, at: new Date().toISOString(), text },
                  ],
                }
              : c,
          ),
        );
        return;
      }

      await supabase.from("case_history").insert({ case_id: id, text });
      await supabase
        .from("cases")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", id);
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const setStatus: StoreValue["setStatus"] = useCallback(
    async (id, status, historyText) => {
      if (!isSupabaseConfigured) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  updatedAt: new Date().toISOString(),
                  history: [
                    ...c.history,
                    {
                      id: `h-${Date.now()}`,
                      at: new Date().toISOString(),
                      text: historyText,
                    },
                  ],
                }
              : c,
          ),
        );
        return;
      }

      await supabase
        .from("cases")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      await supabase.from("case_history").insert({ case_id: id, text: historyText });
      await refreshFromSupabase();
    },
    [refreshFromSupabase],
  );

  const value = useMemo(
    () => ({
      cases,
      clients,
      currentUser,
      ready,
      setCurrentUser,
      addClient,
      updateClientDriveUrl,
      removeClient,
      addCase,
      updateCase,
      removeCase,
      setStatus,
      addHistory,
    }),
    [
      cases,
      clients,
      currentUser,
      ready,
      setCurrentUser,
      addClient,
      updateClientDriveUrl,
      removeClient,
      addCase,
      updateCase,
      removeCase,
      setStatus,
      addHistory,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
