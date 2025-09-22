import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-dvh bg-muted/20 text-foreground" dir="rtl">
      <Header />
      <main className="pb-20 mx-auto max-w-6xl px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
