import { createClient } from "@supabase/supabase-js";

// Read from Vite env. The user should set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

// Create a client lazily and export a getter to avoid creating when envs are missing
let _client:
  | ReturnType<typeof createClient<{ [key: string]: unknown }>>
  | null = null;

export function getSupabase() {
  if (!_client) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn(
        "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable data."
      );
      return null;
    }
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}

export type Lesson = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  watched: boolean | null;
  published_at: string | null;
};

export type Exam = {
  id: string;
  name: string;
  open_at: string;
  close_at: string;
  duration_minutes: number | null;
};

export async function fetchLessons(limit?: number) {
  const supabase = getSupabase();
  if (!supabase) return [] as Lesson[];
  let query = supabase.from("lessons").select("id,title,thumbnail_url,watched,published_at").order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch lessons", error);
    return [] as Lesson[];
  }
  return data as unknown as Lesson[];
}

export async function fetchUnwatchedLessons(limit?: number) {
  const supabase = getSupabase();
  if (!supabase) return [] as Lesson[];
  let query = supabase
    .from("lessons")
    .select("id,title,thumbnail_url,watched,published_at")
    .eq("watched", false)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch lessons", error);
    return [] as Lesson[];
  }
  return data as unknown as Lesson[];
}

export async function fetchOpenExams() {
  const supabase = getSupabase();
  if (!supabase) return [] as Exam[];
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("exams")
    .select("id,name,open_at,close_at,duration_minutes")
    .lte("open_at", now)
    .gte("close_at", now)
    .order("open_at", { ascending: true });
  if (error) {
    console.error("Failed to fetch exams", error);
    return [] as Exam[];
  }
  return data as unknown as Exam[];
}
