import MainLayout from "@/components/layout/MainLayout";
import Placeholder from "@/components/Placeholder";

export function Notes(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">الكتب والمذكرات</h1>
      <Placeholder title="لا يوجد كتب لك الآن" />
    </MainLayout>
  );
}

export function Gallery(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">صور السبورة</h1>
      <Placeholder title="صور متاحة" message="سيتم عرض صور الدروس هنا." />
    </MainLayout>
  );
}

export function Honor(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">لوحة الشرف</h1>
      <Placeholder title="سيتم عرض لوحة الشرف هنا" />
    </MainLayout>
  );
}

export function Assignments(){
  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-4">الواجب</h1>
      <Placeholder title="لا يوجد واجبات الآن" />
    </MainLayout>
  );
}
