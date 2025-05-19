
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeNotifications } from "@/hooks/useRealtime";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import WriterProfile from "./pages/WriterProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WriterDashboard from "./pages/WriterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import LearnMore from "./pages/LearnMore";
import WritersList from "./pages/WritersList";

// Layouts
import MainLayout from "./layouts/MainLayout";
import Favorites from "./pages/Favourites";

const queryClient = new QueryClient();

// Component to set up realtime subscriptions when authenticated
const RealtimeSubscription = () => {
  const { user } = useAuth();

  // Only set up realtime subscriptions if user is logged in
  if (user) {
    useRealtimeNotifications();
  }

  return null;
};

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Public route component that redirects to home if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/browse" element={<MainLayout><BrowseBooks /></MainLayout>} />
        <Route path="/book/:id" element={<MainLayout><BookDetails /></MainLayout>} />
        <Route path="/writer/:id" element={<MainLayout><WriterProfile /></MainLayout>} />
        <Route path="/learn-more" element={<MainLayout><LearnMore /></MainLayout>} />
        <Route path="/writers" element={<MainLayout><WritersList /></MainLayout>} />

        {/* Authentication Routes - Redirect if already logged in */}
        <Route path="/login" element={
          <MainLayout>
            <PublicRoute>
              <Login />
            </PublicRoute>
          </MainLayout>
        } />
        <Route path="/register" element={
          <MainLayout>
            <PublicRoute>
              <Register />
            </PublicRoute>
          </MainLayout>
        } />

        {/* User Profile Routes - Protected */}
        <Route path="/profile" element={
          <MainLayout>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/favorites" element={
          <MainLayout>
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/profile/:id" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* Writer Dashboard - Protected and role-specific */}
        <Route path="/writer-dashboard/*" element={
          <MainLayout>
            <ProtectedRoute>
              <WriterDashboard />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Admin Dashboard - Protected and role-specific */}
        <Route path="/admin-dashboard/*" element={
          <MainLayout>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Catch-all Route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RealtimeSubscription />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
