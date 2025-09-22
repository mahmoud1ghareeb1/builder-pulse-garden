import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLessonById } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
          <CardContent className="py-8 text-center text-muted-foreground">لا توجد محاضرة بهذا المعرف.</CardContent>
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
              <div className="aspect-[16/9] w-full rounded-md bg-muted"/>
              <p className="text-sm text-muted-foreground">تاريخ النشر: {lesson.published_at ? new Date(lesson.published_at).toLocaleString() : "غير متوفر"}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
