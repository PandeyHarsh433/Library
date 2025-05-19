
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ShieldCheck, UserCheck, Users, Trash2,
  ClipboardList, BarChart2, Settings, LogOut, Menu, X, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import AdminDashboardUsers from '@/components/admin/AdminDashboardUsers';
import AdminDashboardApprovals from '@/components/admin/AdminDashboardApprovals';
import AdminDashboardBooks from '@/components/admin/AdminDashboardBooks';
import AdminDashboardComments from '@/components/admin/AdminDashboardComments';
import AdminDashboardSettings from '@/components/admin/AdminDashboardSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActiveRoute = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Redirect if user is not an admin
  useEffect(() => {
    if (!isLoadingProfile && profile && profile.role !== 'admin') {
      navigate('/');
      toast.error('You do not have permission to access the admin dashboard');
    }
  }, [isLoadingProfile, profile, navigate]);

  if (isLoadingProfile) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render the dashboard
  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-20 left-4 z-30 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-cinematic-darker/80 backdrop-blur-md border-cinematic-gray/30 text-cinematic-text hover:text-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <motion.div
          className={`fixed md:static inset-y-16 left-0 z-50 w-72 bg-cinematic-darker border-r border-cinematic-gray/20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } transition-transform duration-300 ease-in-out h-[calc(100vh-64px)]`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-cinematic-gray/20 md:hidden">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-accent mr-2" />
                <span className="text-lg font-serif font-medium">Admin Portal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
                className="text-cinematic-text hover:text-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 py-4">
              <div className="px-3 space-y-1">
                <Link to="/admin-dashboard" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard') && !isActiveRoute('/admin-dashboard/users') && !isActiveRoute('/admin-dashboard/approvals') && !isActiveRoute('/admin-dashboard/books') && !isActiveRoute('/admin-dashboard/comments') && !isActiveRoute('/admin-dashboard/settings')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <BarChart2 className="h-5 w-5 mr-3" />
                    Dashboard
                  </Button>
                </Link>

                <Link to="/admin-dashboard/users" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard/users')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    User Management
                  </Button>
                </Link>

                <Link to="/admin-dashboard/approvals" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard/approvals')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <UserCheck className="h-5 w-5 mr-3" />
                    Book Approvals
                  </Button>
                </Link>

                <Link to="/admin-dashboard/books" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard/books')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Book Management
                  </Button>
                </Link>

                <Link to="/admin-dashboard/comments" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard/comments')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <ClipboardList className="h-5 w-5 mr-3" />
                    Comment Moderation
                  </Button>
                </Link>

                <Link to="/admin-dashboard/settings" onClick={closeSidebar}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActiveRoute('/admin-dashboard/settings')
                      ? 'bg-accent/20 text-accent'
                      : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                      }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Button>
                </Link>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-cinematic-gray/20 space-y-3">
              <Link to="/" onClick={closeSidebar}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-cinematic-text hover:text-accent hover:bg-accent/10"
                >
                  <Home className="h-5 w-5 mr-3" />
                  Return to Lumina
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start text-cinematic-text hover:text-red-500 hover:bg-red-500/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container py-8 max-w-6xl">
            <Routes>
              <Route path="/" element={<AdminDashboardOverview />} />
              <Route path="/users" element={<AdminDashboardUsers />} />
              <Route path="/approvals" element={<AdminDashboardApprovals />} />
              <Route path="/books" element={<AdminDashboardBooks />} />
              <Route path="/comments" element={<AdminDashboardComments />} />
              <Route path="/settings" element={<AdminDashboardSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
