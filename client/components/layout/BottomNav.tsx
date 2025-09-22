import { Home, BookOpenText, GraduationCap, BarChart2, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav(){
  const Item = ({to, icon:Icon, label}:{to:string; icon: any; label:string})=> (
    <NavLink to={to} className={({isActive})=>`flex flex-col items-center justify-center gap-1 text-xs flex-1 py-2 ${isActive?"text-primary":"text-muted-foreground"}`}>
      <Icon className="size-5"/>
      <span>{label}</span>
    </NavLink>
  );
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="mx-auto max-w-6xl px-2 flex">
        <Item to="/account" icon={User} label="حسابي"/>
        <Item to="/grades" icon={BarChart2} label="الدرجات والنتائج"/>
        <Item to="/lectures" icon={GraduationCap} label="ا��محاضرات"/>
        <Item to="/exams" icon={BookOpenText} label="الاختبارات"/>
        <Item to="/" icon={Home} label="الصفحة الرئيسية"/>
      </div>
    </nav>
  );
}
