import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from "./pages/Calculator";
import ProfileSelect from "./pages/ProfileSelect";
import Register from "./pages/Register";
import SupporterLogin from "./pages/SupporterLogin";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useSupabaseConnection } from "./hooks/useSupabase";

const queryClient = new QueryClient();

// Indicador de conexão Supabase (temporário para teste)
const SupabaseIndicator = () => {
  const { isConnected, error } = useSupabaseConnection();

  return (
    <div className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg text-xs font-medium bg-card border border-border">
      {isConnected ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Supabase Conectado
        </span>
      ) : error ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
          Erro: {error}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></span>
          Conectando...
        </span>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* <SupabaseIndicator /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/profile-select" element={<ProfileSelect />} />
          <Route path="/supporter-login" element={<SupporterLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
