import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchUnwatchedLessons, fetchOpenExams, Lesson } from "@/lib/supabase";
import { ChevronLeft, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index(){
  const { data: unwatched = [], isLoading: loadingLessons } = useQuery({
    queryKey:["unwatched-lessons"],
    queryFn: () => fetchUnwatchedLessons(10),
  });

  const { data: openExams = [], isLoading: loadingExams } = useQuery({
    queryKey:["open-exams"],
    queryFn: () => fetchOpenExams(),
  });

  return (
    <MainLayout>
      <section className="mb-6">
        <Card className="bg-accent/30 border-none">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">أنت تقدر، أنت ابن مصر ضد الكسر.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold tracking-tight">الحصص غير المشاهدة</h2>
          <Link to="/lectures" className="text-primary flex items-center gap-1">عرض جميع الحصص <ChevronLeft className="size-4"/></Link>
        </div>
        {loadingLessons ? (
          <p className="text-sm text-muted-foreground">جارِ التحميل...</p>
        ) : unwatched.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">لا توجد حصص غير مشاهدة حالياً</CardContent>
          </Card>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 rtl:space-x-reverse">
            {unwatched.map((l:Lesson)=> (
              <article key={l.id} className="min-w-[260px]">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-1">{l.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-[16/9] w-full rounded-md bg-muted overflow-hidden flex items-center justify-center">
                      <PlayCircle className="size-10 text-primary"/>
                    </div>
                    <Button asChild className="w-full"><Link to={`/lectures/${l.id}`}>مشاهدة</Link></Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">مستواك العام حسب متوسط دفعتك</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">لا توجد بيانات كافية لعرض المؤشر حتى الآن.</p>
            <div className="w-full h-3 rounded-full bg-muted">
              <div className="h-3 w-[0%] rounded-full bg-primary"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">نسبة أدائك في الامتحانات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-3 rounded-full bg-muted">
              <div className="h-3 w-[0%] rounded-full bg-destructive"/>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-extrabold tracking-tight">اختبارات متاحة</h2>
        {loadingExams ? (
          <p className="text-sm text-muted-foreground">جارِ التحميل...</p>
        ) : openExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">لا توجد اختبارات متاحة الآن</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {openExams.map((e)=> (
              <Card key={e.id} className="bg-accent/40">
                <CardHeader className="pb-2"><CardTitle className="text-base">{e.name}</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    <div>من {new Date(e.open_at).toLocaleString()}</div>
                    <div>إلى {new Date(e.close_at).toLocaleString()}</div>
                  </div>
                  <Button asChild><Link to={`/exams/${e.id}`}>بدء الاختبار</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLink to="/notes" label="الكتب والمذكرات"/>
        <QuickLink to="/assignments" label="الواجب ورسائل المدرس"/>
        <QuickLink to="/gallery" label="صور السبورة"/>
        <QuickLink to="/grades" label="الدرجات والنتائج"/>
        <QuickLink to="/honor" label="لوحة الشرف"/>
        <QuickLink to="/account" label="حسابي"/>
      </section>
    </MainLayout>
  );
}

function QuickLink({to,label}:{to:string; label:string}){
  return (
    <Link to={to} className="rounded-xl border bg-card hover:shadow-md transition-shadow p-5 flex items-center justify-center text-center text-sm font-medium">
      {label}
    </Link>
  );
}
