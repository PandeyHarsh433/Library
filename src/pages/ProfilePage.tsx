
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { User, Mail, Calendar, BookOpen, Star, MapPin, Link as LinkIcon, Edit, ChevronLeft, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useProfile } from '@/hooks/useProfile';
import { useBooks } from '@/hooks/useBooks';
import { useMyComments } from '@/hooks/useComments';
import ShareModal from '@/components/ShareModal';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // If ID is provided, fetch that user's profile. Otherwise, fetch the current user's profile
  const { data: viewedProfile, isLoading: isLoadingViewedProfile } = useUserProfile(id);
  const { data: currentUserProfile, isLoading: isLoadingCurrentProfile } = useProfile();
  
  const profileData = id ? viewedProfile : currentUserProfile;
  const isLoading = id ? isLoadingViewedProfile : isLoadingCurrentProfile;
  
  // Check if the viewed profile is the current user's profile
  useEffect(() => {
    if (user && ((id && id === user.id) || !id)) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [user, id]);
  
  // Fetch user's books and comments
  const { data: userBooks, isLoading: isLoadingBooks } = useBooks();
  
  const { data: userComments, isLoading: isLoadingComments } = useMyComments();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  if (!profileData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-cinematic-text/70 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
          <Link to="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    );
  }
  
  const profileUrl = `${window.location.origin}/profile/${profileData.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex flex-col items-center md:items-start">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profileData.avatar_url || ''} alt={profileData.full_name || 'User'} />
            <AvatarFallback className="bg-accent/20 text-accent text-3xl">
              {(profileData.full_name || profileData.username || 'U')[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-1">
                {profileData.full_name || profileData.username || 'Anonymous User'}
              </h1>
              {profileData.username && (
                <p className="text-cinematic-text/70">@{profileData.username}</p>
              )}
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0 justify-center md:justify-end">
              {isOwnProfile ? (
                <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                  <Link to="/writer-dashboard/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              ) : (
                <Button onClick={() => setShareModalOpen(true)} variant="outline" className="border-cinematic-gray/30">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              )}
            </div>
          </div>
          
          {profileData.bio && (
            <p className="text-cinematic-text mb-4">{profileData.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {profileData.role && (
              <div className="flex items-center">
                <User className="h-4 w-4 text-accent mr-2" />
                <span className="capitalize">{profileData.role}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-accent mr-2" />
              <span>Joined {new Date(profileData.created_at).toLocaleDateString()}</span>
            </div>
            
            {!isLoadingBooks && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-accent mr-2" />
                <span>{userBooks?.length || 0} Books</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Separator className="mb-8" />
      
      {/* Profile Content */}
      <Tabs defaultValue="books" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent border-cinematic-gray/20 p-0">
          <TabsTrigger 
            value="books" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent"
          >
            Books
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent"
          >
            Activity
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger 
              value="settings" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent"
            >
              Settings
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="books">
          {isLoadingBooks ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : userBooks && userBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBooks.map((book) => (
                <Card key={book.id} className="border-cinematic-gray/20 bg-cinematic-darker/30 overflow-hidden">
                  <CardContent className="p-0">
                    <Link to={`/book/${book.id}`} className="block">
                      <div className="flex h-full">
                        <div className="w-1/3 bg-cinematic-dark/60 flex items-center justify-center p-4">
                          <div className="relative aspect-[2/3] w-full h-auto overflow-hidden rounded">
                            <img
                              src={book.cover_image || '/placeholder.svg'}
                              alt={book.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="w-2/3 p-4">
                          <h3 className="font-serif font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {book.genre && book.genre.map((genre, index) => (
                              <Badge key={index} variant="outline" className="bg-accent/10 text-accent/90 border-accent/20">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-cinematic-text/70 line-clamp-3">{book.summary}</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-cinematic-text/30 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Books Yet</h3>
              <p className="text-cinematic-text/70">
                {isOwnProfile 
                  ? "You haven't published any books yet." 
                  : `${profileData.full_name || profileData.username || 'This user'} hasn't published any books yet.`}
              </p>
              {isOwnProfile && profileData.role === 'writer' && (
                <Button className="mt-4 bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                  <Link to="/writer-dashboard/add-book">Publish Your First Book</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activity">
          {isLoadingComments ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : userComments && userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.map((comment) => (
                <Card key={comment.id} className="border-cinematic-gray/20 bg-cinematic-darker/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <Link to={`/book/${comment.book_id}`} className="text-accent hover:underline font-medium">
                        {comment.books?.title || 'Unknown Book'}
                      </Link>
                      <span className="text-sm text-cinematic-text/60">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-cinematic-text">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-cinematic-text/30 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Comments Yet</h3>
              <p className="text-cinematic-text/70">
                {isOwnProfile 
                  ? "You haven't made any comments yet." 
                  : `${profileData.full_name || profileData.username || 'This user'} hasn't made any comments yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4 bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                  <Link to="/browse">Browse Books to Comment</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Profile Settings</h3>
                  <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                    <Link to="/writer-dashboard/settings">Manage Profile Settings</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {profileData.role === 'writer' && (
                <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">Writer Dashboard</h3>
                    <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                      <Link to="/writer-dashboard">Go to Writer Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {profileData.role === 'admin' && (
                <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">Admin Dashboard</h3>
                    <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
                      <Link to="/admin-dashboard">Go to Admin Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)}
        title={profileData.full_name || profileData.username || 'User Profile'}
        url={profileUrl}
        type="writer"
      />
    </motion.div>
  );
};

export default ProfilePage;
