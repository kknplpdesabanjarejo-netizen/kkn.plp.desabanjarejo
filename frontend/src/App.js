import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PublicSite from "@/pages/PublicSite";
import NewsDetail from "@/pages/NewsDetail";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ResourceManager from "@/pages/admin/ResourceManager";
import SettingsPage from "@/pages/admin/SettingsPage";
import ActivityLogsPage from "@/pages/admin/ActivityLogsPage";
import { RESOURCES } from "@/pages/admin/resourceConfig";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              {RESOURCES.map((r) => (
                <Route key={r.path} path={r.path} element={<ResourceManager config={r} />} />
              ))}
              <Route path="settings" element={<SettingsPage />} />
              <Route path="activity-logs" element={<ActivityLogsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
