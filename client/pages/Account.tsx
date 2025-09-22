import MainLayout from "@/components/layout/MainLayout";
import Placeholder from "@/components/Placeholder";

export default function Account(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">حسابي</h1>
      <Placeholder title="ملف الطالب" message="أكمل إعداد Supabase لعرض وتحديث بيانات الحساب."/>
    </MainLayout>
  );
}
