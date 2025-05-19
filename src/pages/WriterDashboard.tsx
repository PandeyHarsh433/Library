
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, PlusCircle, Clock, CheckCircle, XCircle, 
  BarChart2, User, Settings, LogOut, Menu, X, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import WriterDashboardOverview from '@/components/writer/WriterDashboardOverview';
import WriterDashboardMyBooks from '@/components/writer/WriterDashboardMyBooks';
import WriterDashboardAddBook from '@/components/writer/WriterDashboardAddBook';
import WriterDashboardPendingBooks from '@/components/writer/WriterDashboardPendingBooks';
import WriterDashboardComments from '@/components/writer/WriterDashboardComments';
import WriterDashboardSettings from '@/components/writer/WriterDashboardSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const WriterDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
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
  
  // Redirect if user is not a writer or admin
  if (!isLoadingProfile && profile && profile.role !== 'writer' && profile.role !== 'admin') {
    navigate('/');
    toast.error('You do not have permission to access the writer dashboard');
    return null;
  }
  
  return (
    <div className="pt-16 min-h-screen">
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
          className={`fixed md:static inset-y-16 left-0 z-50 w-64 bg-cinematic-darker border-r border-cinematic-gray/20 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transition-transform duration-300 ease-in-out h-[calc(100vh-64px)]`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-cinematic-gray/20 md:hidden">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-accent mr-2" />
                <span className="text-lg font-serif font-medium">Writer Portal</span>
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
                <Link to="/writer-dashboard" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard') && !isActiveRoute('/writer-dashboard/my-books') && !isActiveRoute('/writer-dashboard/add-book') && !isActiveRoute('/writer-dashboard/pending') && !isActiveRoute('/writer-dashboard/comments') && !isActiveRoute('/writer-dashboard/settings')
                        ? 'bg-accent/20 text-accent'
                        : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <BarChart2 className="h-5 w-5 mr-3" />
                    Overview
                  </Button>
                </Link>
                
                <Link to="/writer-dashboard/my-books" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard/my-books')
                        ? 'bg-accent/20 text-accent'
                        : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    My Books
                  </Button>
                </Link>
                
                <Link to="/writer-dashboard/add-book" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard/add-book')
                        ? 'bg-accent/20 text-accent'
                        : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <PlusCircle className="h-5 w-5 mr-3" />
                    Add New Book
                  </Button>
                </Link>
                
                <Link to="/writer-dashboard/pending" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard/pending')
                        ? 'bg-accent/20 text-accent'
                        : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-3" />
                    Pending Approvals
                  </Button>
                </Link>
                
                <Link to="/writer-dashboard/comments" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard/comments')
                        ? 'bg-accent/20 text-accent'
                        : 'text-cinematic-text hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Reader Comments
                  </Button>
                </Link>
                
                <Link to="/writer-dashboard/settings" onClick={closeSidebar}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      isActiveRoute('/writer-dashboard/settings')
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
              <Route path="/" element={<WriterDashboardOverview />} />
              <Route path="/my-books" element={<WriterDashboardMyBooks />} />
              <Route path="/add-book" element={<WriterDashboardAddBook />} />
              <Route path="/pending" element={<WriterDashboardPendingBooks />} />
              <Route path="/comments" element={<WriterDashboardComments />} />
              <Route path="/settings" element={<WriterDashboardSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
