import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lectures from "./pages/Lectures";
import LectureDetail from "./pages/LectureDetail";
import Exams from "./pages/Exams";
import ExamDetail from "./pages/ExamDetail";
import ExamStart from "./pages/ExamStart";
import Grades from "./pages/Grades";
import Account from "./pages/Account";
import { Notes, Gallery, Honor, Assignments } from "./pages/Placeholders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:id" element={<LectureDetail />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:id" element={<ExamDetail />} />
          <Route path="/exams/:id/start" element={<ExamStart />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/honor" element={<Honor />} />
          <Route path="/assignments" element={<Assignments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
