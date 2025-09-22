import { Menu, Home, GraduationCap, BarChart2, BookOpenText, LogOut, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="القائمة">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80" dir="rtl">
              <div className="mt-8 flex flex-col gap-3 text-right">
                <NavLink to="/" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 ${isActive?"bg-accent text-accent-foreground":"hover:bg-accent"}`}> <Home className="size-5"/> <span>الصفحة الرئيسية</span> </NavLink>
                <NavLink to="/exams" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 ${isActive?"bg-accent text-accent-foreground":"hover:bg-accent"}`}> <BookOpenText className="size-5"/> <span>الاختبارات</span> </NavLink>
                <NavLink to="/lectures" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 ${isActive?"bg-accent text-accent-foreground":"hover:bg-accent"}`}> <GraduationCap className="size-5"/> <span>المحاضرات</span> </NavLink>
                <NavLink to="/grades" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 ${isActive?"bg-accent text-accent-foreground":"hover:bg-accent"}`}> <BarChart2 className="size-5"/> <span>الدرجات والنتائج</span> </NavLink>
                <NavLink to="/account" className={({isActive})=>`flex items-center gap-2 rounded-md px-3 py-2 ${isActive?"bg-accent text-accent-foreground":"hover:bg-accent"}`}> <User className="size-5"/> <span>حسابي</span> </NavLink>
                <Link to="/logout" className="flex items-center gap-2 rounded-md px-3 py-2 text-red-600 hover:bg-red-50"> <LogOut className="size-5"/> <span>تسجيل الخروج</span> </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-lg font-bold">المفيد في الفيزياء</Link>
        </div>
        <div className="flex items-center gap-2"/>
      </div>
    </header>
  );
}
