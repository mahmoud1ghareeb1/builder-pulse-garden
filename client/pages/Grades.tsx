import MainLayout from "@/components/layout/MainLayout";
import Placeholder from "@/components/Placeholder";

export default function Grades(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">الدرجات والنتائج</h1>
      <Placeholder title="نتائج الاختبارات" message="سيتم عرض النتائج هنا عند توصيل قاعدة البيانات."/>
    </MainLayout>
  );
}
