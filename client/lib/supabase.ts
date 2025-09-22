import { createClient } from "@supabase/supabase-js";

// Read from Vite env. The user should set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

// Create a client lazily and export a getter to avoid creating when envs are missing
let _client: ReturnType<
  typeof createClient<{ [key: string]: unknown }>
> | null = null;

export function getSupabase() {
  if (!_client) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn(
        "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable data.",
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
  video_url: string | null;
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

export type ExamQuestion = {
  id: string;
  title: string;
  order_no: number;
};

export type ExamChoice = {
  id: string;
  question_id: string;
  text: string;
  correct: boolean | null;
};

export type ExamQuestionWithChoices = ExamQuestion & { choices: ExamChoice[] };

export async function fetchLessons(limit?: number) {
  const supabase = getSupabase();
  if (!supabase) return [] as Lesson[];
  try {
    let query = supabase
      .from("lessons")
      .select("id,title,thumbnail_url,video_url,watched,published_at")
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Lesson[];
  } catch (error: any) {
    // Fallback if video_url column doesn't exist yet
    if (
      error?.code === "42703" ||
      String(error?.message || "").includes("video_url")
    ) {
      let query = supabase
        .from("lessons")
        .select("id,title,thumbnail_url,watched,published_at")
        .order("published_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error: e2 } = await query;
      if (!e2) return data as unknown as Lesson[];
    }
    console.error("Failed to fetch lessons", {
      message: error?.message,
      code: error?.code,
    });
    return [] as Lesson[];
  }
}

export async function fetchUnwatchedLessons(limit?: number) {
  const supabase = getSupabase();
  if (!supabase) return [] as Lesson[];
  try {
    let query = supabase
      .from("lessons")
      .select("id,title,thumbnail_url,video_url,watched,published_at")
      .eq("watched", false)
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Lesson[];
  } catch (error: any) {
    if (
      error?.code === "42703" ||
      String(error?.message || "").includes("video_url")
    ) {
      let query = supabase
        .from("lessons")
        .select("id,title,thumbnail_url,watched,published_at")
        .eq("watched", false)
        .order("published_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error: e2 } = await query;
      if (!e2) return data as unknown as Lesson[];
    }
    console.error("Failed to fetch lessons", {
      message: error?.message,
      code: error?.code,
    });
    return [] as Lesson[];
  }
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

export async function fetchExamById(id: string) {
  const supabase = getSupabase();
  if (!supabase) return null as unknown as Exam | null;
  const { data, error } = await supabase
    .from("exams")
    .select("id,name,open_at,close_at,duration_minutes")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Failed to fetch exam", error);
    return null;
  }
  return data as unknown as Exam;
}

export async function fetchExamQuestions(examId: string) {
  const supabase = getSupabase();
  if (!supabase) return [] as ExamQuestion[];
  const { data, error } = await supabase
    .from("exam_questions")
    .select("id,title,order_no")
    .eq("exam_id", examId)
    .order("order_no", { ascending: true });
  if (error) {
    console.error("Failed to fetch exam questions", error);
    return [] as ExamQuestion[];
  }
  return data as unknown as ExamQuestion[];
}

export async function fetchExamFull(examId: string) {
  const supabase = getSupabase();
  if (!supabase) return [] as ExamQuestionWithChoices[];
  const { data, error } = await supabase
    .from("exam_questions")
    .select(
      "id,title,order_no, choices:exam_choices(id,text,question_id,correct)",
    )
    .eq("exam_id", examId)
    .order("order_no", { ascending: true });
  if (error) {
    console.error("Failed to fetch exam full", error);
    return [] as ExamQuestionWithChoices[];
  }
  return data as unknown as ExamQuestionWithChoices[];
}

export async function startExamAttempt(examId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  // if there is unfinished attempt, reuse it
  const { data: existing } = await supabase
    .from("exam_attempts")
    .select("id,finished_at")
    .eq("exam_id", examId)
    .eq("user_id", user.id)
    .is("finished_at", null)
    .limit(1)
    .maybeSingle();
  if (existing && !existing.finished_at) return existing.id as string;
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({ exam_id: examId, user_id: user.id })
    .select("id")
    .single();
  if (error) {
    console.error("start attempt error", error);
    return null;
  }
  return (data as any).id as string;
}

export async function saveAnswer(
  attemptId: string,
  questionId: string,
  choiceId: string,
) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { error } = await supabase
    .from("attempt_answers")
    .upsert({
      attempt_id: attemptId,
      question_id: questionId,
      choice_id: choiceId,
    });
  if (error) {
    console.error("save answer error", error);
  }
}

export async function finishAttempt(attemptId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  // compute score client-side for now
  const { data: answers } = await supabase
    .from("attempt_answers")
    .select("question_id, choice_id")
    .eq("attempt_id", attemptId);
  if (!answers) return null;
  const questionIds = [...new Set(answers.map((a: any) => a.question_id))];
  const { data: correct } = await supabase
    .from("exam_choices")
    .select("id, question_id, correct")
    .in("question_id", questionIds);
  const correctSet = new Set(
    (correct || []).filter((c: any) => c.correct).map((c: any) => c.id),
  );
  let score = 0;
  for (const a of answers) if (correctSet.has(a.choice_id)) score++;
  await supabase
    .from("exam_attempts")
    .update({ finished_at: new Date().toISOString(), score })
    .eq("id", attemptId);
  return score;
}

export async function fetchLessonById(id: string) {
  const supabase = getSupabase();
  if (!supabase) return null as unknown as Lesson | null;
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id,title,thumbnail_url,video_url,watched,published_at")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as unknown as Lesson;
  } catch (error: any) {
    if (
      error?.code === "42703" ||
      String(error?.message || "").includes("video_url")
    ) {
      const { data, error: e2 } = await supabase
        .from("lessons")
        .select("id,title,thumbnail_url,watched,published_at")
        .eq("id", id)
        .single();
      if (!e2) return data as unknown as Lesson;
    }
    console.error("Failed to fetch lesson", {
      message: error?.message,
      code: error?.code,
    });
    return null;
  }
}

export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function markLessonWatched(lessonId: string, watched: boolean) {
  const supabase = getSupabase();
  if (!supabase) return { error: "no-client" } as const;
  const user = await getCurrentUser();
  if (!user) return { error: "not-authenticated" } as const;
  const { error } = await supabase
    .from("lesson_progress")
    .upsert({ lesson_id: lessonId, user_id: user.id, watched })
    .select()
    .single();
  if (error) return { error } as const;
  return { success: true } as const;
}
