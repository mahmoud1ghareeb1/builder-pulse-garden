import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchExamFull, startExamAttempt, saveAnswer, finishAttempt } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function ExamStart(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: questions = [], isLoading } = useQuery({
    queryKey:["exam-full", id],
    queryFn: ()=> fetchExamFull(id as string),
    enabled: Boolean(id)
  });
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});

  useEffect(()=>{
    (async ()=>{
      if (!id) return;
      const att = await startExamAttempt(id);
      setAttemptId(att);
    })();
  },[id]);

  async function onSelect(qid:string, cid:string){
    setAnswers(a=> ({...a, [qid]: cid}));
    if (attemptId) await saveAnswer(attemptId, qid, cid);
  }

  async function onSubmit(){
    if (!attemptId) return;
    const score = await finishAttempt(attemptId);
    alert(`تم الإنهاء. نتيجتك: ${score}`);
    navigate("/grades");
  }

  return (
    <MainLayout>
      {isLoading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : questions.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">لا توجد أسئلة.</CardContent></Card>
      ) : (
        <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); onSubmit();}}>
          {questions.map((q, idx)=> (
            <Card key={q.id}>
              <CardHeader className="pb-2"><CardTitle className="text-base">{idx+1}. {q.title}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2">
                  {(q as any).choices?.map((c:any)=> (
                    <label key={c.id} className="flex items-center gap-3 rounded-md border p-3">
                      <input type="radio" name={q.id} value={c.id} checked={answers[q.id]===c.id} onChange={()=> onSelect(q.id, c.id)} />
                      <span>{c.text}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button type="submit">إنهاء الامتحان</Button>
          </div>
        </form>
      )}
    </MainLayout>
  );
}
