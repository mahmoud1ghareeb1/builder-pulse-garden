import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchLessons, Lesson } from "@/lib/supabase";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Lectures(){
  const { data: lessons = [], isLoading } = useQuery({
    queryKey:["lessons"],
    queryFn: () => fetchLessons(),
  });

  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">الحصص والمحاضرات</h1>
      {isLoading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">لا توجد محاضرات متاحة الآن</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l:Lesson)=> (
            <Card key={l.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{l.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-[16/9] w-full rounded-md bg-muted overflow-hidden flex items-center justify-center relative">
                  {l.watched ? (
                    <CheckCircle2 className="size-9 text-emerald-500"/>
                  ) : (
                    <PlayCircle className="size-10 text-primary"/>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button asChild className="flex-1"><Link to={`/lectures/${l.id}`}>اقرأ المزيد</Link></Button>
                  <span className="text-xs text-muted-foreground">{l.watched?"تمت مشاهدة الفيديو":""}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
