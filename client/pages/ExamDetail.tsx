import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchExamById, fetchExamQuestions } from "@/lib/supabase";

export default function ExamDetail(){
  const { id } = useParams();
  const { data: exam, isLoading } = useQuery({
    queryKey:["exam", id],
    queryFn: ()=> fetchExamById(id as string),
    enabled: Boolean(id)
  });
  const { data: questions = [] } = useQuery({
    queryKey:["exam-questions", id],
    queryFn: ()=> fetchExamQuestions(id as string),
    enabled: Boolean(id)
  });

  return (
    <MainLayout>
      {isLoading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : !exam ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">لا يوجد امتحان بهذا المعرف.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold">{exam.name}</h1>
            <Button asChild variant="secondary"><Link to="/exams">عودة</Link></Button>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">تفاصيل الامتحان</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <div>من {new Date(exam.open_at).toLocaleString()}</div>
                <div>إلى {new Date(exam.close_at).toLocaleString()}</div>
                {exam.duration_minutes ? (<div>المدة: {exam.duration_minutes} دقيقة</div>) : null}
              </div>
              <div className="text-sm">عدد الأسئلة: {questions.length}</div>
              <Button className="w-full" disabled={questions.length===0}>بدء الامتحان</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
