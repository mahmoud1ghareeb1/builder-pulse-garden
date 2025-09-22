import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function Account(){
  const supabase = getSupabase();
  const [authUser, setAuthUser] = useState<any>(null);
  const [values, setValues] = useState({
    full_name: "",
    phone: "",
    parent_phone: "",
    grade: "",
    group_name: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase.auth.getUser();
      setAuthUser(data.user ?? null);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name,phone,parent_phone,grade,group_name")
          .eq("id", data.user.id)
          .single();
        if (profile) setValues(profile as any);
      }
      setLoading(false);
    })();
  }, []);

  async function save(){
    if (!supabase || !authUser) return;
    await supabase.from("profiles").upsert({ id: authUser.id, ...values });
    alert("تم الحفظ");
  }

  if (!supabase) return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">حسابي</h1>
      <p className="text-muted-foreground">البيانات ستظهر بعد ضبط Supabase.</p>
    </MainLayout>
  );

  if (!authUser) return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">حسابي</h1>
      <p className="text-muted-foreground">من فضلك سجّل الدخول أولاً.</p>
    </MainLayout>
  );

  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">حسابي</h1>
      {loading ? (
        <p className="text-muted-foreground">جارِ التحميل...</p>
      ) : (
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e)=>{e.preventDefault(); save();}}>
          {([
            ["full_name","الاسم"],
            ["phone","رقم الهاتف"],
            ["parent_phone","رقم ولي الأمر"],
            ["grade","الصف ال��راسي"],
            ["group_name","المجموعة"],
          ] as const).map(([key,label])=> (
            <label key={key} className="grid gap-2">
              <span className="text-sm text-muted-foreground">{label}</span>
              <input
                className="h-11 rounded-md border bg-background px-3"
                value={(values as any)[key] ?? ""}
                onChange={(e)=> setValues(v=> ({...v, [key]: e.target.value}))}
              />
            </label>
          ))}
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      )}
    </MainLayout>
  );
}
