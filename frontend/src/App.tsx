import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { CaseProvider } from "@/hooks/useCaseContext";
import { Topbar } from "@/components/Topbar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import SubmitCasePage from "@/pages/SubmitCasePage";
import ResultsPage from "@/pages/ResultsPage";
import CaseHistoryPage from "@/pages/CaseHistoryPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CaseProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                  <Topbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/submit" element={<SubmitCasePage />} />
                      <Route path="/results" element={<ResultsPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/history"
                        element={
                          <ProtectedRoute>
                            <CaseHistoryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </CaseProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
