import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchOpenExams } from "@/lib/supabase";
import { Link } from "react-router-dom";

export default function Exams(){
  const { data: exams = [], isLoading } = useQuery({
    queryKey:["open-exams"],
    queryFn: () => fetchOpenExams(),
  });

  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">الاختبارات</h1>
      {isLoading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">لا توجد اختبارات متاحة الآن</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams.map((e)=> (
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
    </MainLayout>
  );
}
