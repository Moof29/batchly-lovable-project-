
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sales/*" element={<div>Sales Module (Coming Soon)</div>} />
          <Route path="/purchases/*" element={<div>Purchases Module (Coming Soon)</div>} />
          <Route path="/inventory/*" element={<div>Inventory Module (Coming Soon)</div>} />
          <Route path="/accounting/*" element={<div>Accounting Module (Coming Soon)</div>} />
          <Route path="/people/*" element={<div>People Module (Coming Soon)</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
