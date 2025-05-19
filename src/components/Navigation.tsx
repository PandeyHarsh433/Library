
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, BookOpen, User, LogOut, Settings,
  FileText, PenTool, ShieldCheck, Home, Bell, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import SearchModal from '@/components/SearchModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const getProfileMenuItems = () => {
    const items = [
      {
        label: 'Profile',
        icon: <User className="h-4 w-4 mr-2" />,
        onClick: () => navigate('/profile'),
      },
      {
        label: 'Favorites',
        icon: <Heart className="h-4 w-4 mr-2" />,
        onClick: () => navigate('/favorites'),
      }
    ];

    // Add role-specific items
    if (profile?.role === 'writer') {
      items.push({
        label: 'Writer Dashboard',
        icon: <PenTool className="h-4 w-4 mr-2" />,
        onClick: () => navigate('/writer-dashboard'),
      });
    } else if (profile?.role === 'admin') {
      items.push({
        label: 'Admin Dashboard',
        icon: <ShieldCheck className="h-4 w-4 mr-2" />,
        onClick: () => navigate('/admin-dashboard'),
      });
    }

    // Add common items
    items.push(
      {
        label: 'Settings',
        icon: <Settings className="h-4 w-4 mr-2" />,
        onClick: () => profile?.role === 'writer'
          ? navigate('/writer-dashboard/settings')
          : navigate('/profile/settings'),
      },
      {
        label: 'Logout',
        icon: <LogOut className="h-4 w-4 mr-2" />,
        onClick: handleSignOut,
      }
    );

    return items;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cinematic-darker/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center"
            >
              <BookOpen className="h-8 w-8 text-accent mr-2" />
              <span className="text-2xl font-serif font-bold text-gradient">Folio</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `text-base font-medium highlight-hover ${isActive ? 'text-accent' : 'text-cinematic-text hover:text-cinematic-highlight'}`
              }
            >
              Browse
            </NavLink>
            <NavLink
              to="/writers"
              className={({ isActive }) =>
                `text-base font-medium highlight-hover ${isActive ? 'text-accent' : 'text-cinematic-text hover:text-cinematic-highlight'}`
              }
            >
              Writers
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              className="text-cinematic-text hover:text-accent"
              onClick={openSearchModal}
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-accent hover:bg-accent/10 flex items-center gap-2">
                    {profile?.avatar_url ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url} alt="Profile" />
                      </Avatar>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-cinematic-text/70">
                        {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'writer' ? 'Writer' : 'Reader'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getProfileMenuItems().map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="cursor-pointer flex items-center"
                      onClick={item.onClick}
                    >
                      {item.icon}
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="border-cinematic-gray/70 text-cinematic-text hover:text-accent hover:border-accent">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-cinematic-text hover:text-accent"
              onClick={openSearchModal}
            >
              <Search className="h-5 w-5" />
            </Button>

            {user && (
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                  <AvatarFallback className="bg-accent/20 text-accent text-xs">
                    {profile?.full_name
                      ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-cinematic-text hover:text-accent"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-cinematic-darker/95 backdrop-blur-lg border-t border-cinematic-gray/20"
          >
            <div className="px-4 py-6 space-y-6">
              <Link
                to="/browse"
                className="block text-lg font-medium text-cinematic-text hover:text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to="/writers"
                className="block text-lg font-medium text-cinematic-text hover:text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Writers
              </Link>

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    {profile?.avatar_url ? (
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={profile.avatar_url} alt="Profile" />
                        <AvatarFallback className="bg-accent/20 text-accent">
                          {profile?.full_name
                            ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                            : profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{profile?.full_name || 'User'}</div>
                      <div className="text-sm text-cinematic-text/70">
                        {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'writer' ? 'Writer' : 'Reader'}
                      </div>
                    </div>
                  </div>

                  {getProfileMenuItems().map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-cinematic-text hover:text-accent"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        item.onClick();
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-accent text-cinematic-darker hover:bg-accent/90">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="outline" className="w-full border-cinematic-gray/70 text-cinematic-text hover:text-accent hover:border-accent">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
};

export default Navigation;
