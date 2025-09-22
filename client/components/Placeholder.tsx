export default function Placeholder({ title, message }: { title: string; message?: string }){
  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{message ?? "لا توجد بيانات للعرض حالياً"}</p>
    </div>
  );
}
