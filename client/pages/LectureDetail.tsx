import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLessonById } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { markLessonWatched } from "@/lib/supabase";

export default function LectureDetail(){
  const { id } = useParams();
  const { data: lesson, isLoading } = useQuery({
    queryKey:["lesson", id],
    queryFn: ()=> fetchLessonById(id as string),
    enabled: Boolean(id),
  });

  return (
    <MainLayout>
      {isLoading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : !lesson ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">لا ت��جد محاضرة بهذا المعرف.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold line-clamp-2">{lesson.title}</h1>
            <Button asChild variant="secondary"><Link to="/lectures">عودة</Link></Button>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">تفاصيل المحاضرة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <YouTubePlayer url={lesson.video_url ?? ''} />
              <p className="text-sm text-muted-foreground">تاريخ النشر: {lesson.published_at ? new Date(lesson.published_at).toLocaleString() : "غير متوفر"}</p>
              <WatchedToggle id={lesson.id} />
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}

function toYouTubeEmbed(url: string){
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return null;
}

function YouTubePlayer({url}:{url:string}){
  const embed = toYouTubeEmbed(url);
  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-black/5">
      {embed ? (
        <iframe className="w-full h-full" src={`${embed}?rel=0`} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      ) : (
        <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">لا يوجد رابط فيديو</div>
      )}
    </div>
  );
}

function WatchedToggle({id}:{id:string}){
  async function handle(){
    const res = await markLessonWatched(id, true);
    if ('error' in res) alert('يستلزم تسجيل الدخول لتسجيل المشاهدة');
  }
  return (
    <Button onClick={handle} className="w-full">تحديد كمُشاهد</Button>
  );
}
