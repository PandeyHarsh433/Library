
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Clock, User, Star, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useMyBooks } from '@/hooks/useBooks';
import { useWriterComments } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const WriterDashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { data: books, isLoading: isLoadingBooks } = useMyBooks();
  const { data: comments, isLoading: isLoadingComments } = useWriterComments(user?.id);
  
  const [pendingBooks, setPendingBooks] = useState<number>(0);
  const [approvedBooks, setApprovedBooks] = useState<number>(0);
  const [totalReaders, setTotalReaders] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  
  // Get books by status
  useEffect(() => {
    if (books) {
      setPendingBooks(books.filter(book => book.status === 'pending').length);
      setApprovedBooks(books.filter(book => book.status === 'approved').length);
    }
  }, [books]);
  
  // Get total readers (unique commenters on writer's books)
  useEffect(() => {
    if (comments) {
      const uniqueReaders = new Set(comments.map(comment => comment.user_id));
      setTotalReaders(uniqueReaders.size);
    }
  }, [comments]);
  
  // Simulate book performance data
  useEffect(() => {
    if (books) {
      setIsLoadingStats(false);
    }
  }, [books]);
  
  if (isLoadingBooks || isLoadingComments || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  // Get approved books for performance display
  const approvedBooksList = books?.filter(book => book.status === 'approved') || [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Writer Dashboard</h1>
        <p className="text-cinematic-text/70">Welcome back. Here's an overview of your book performance.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Books</CardTitle>
            <CardDescription>Published & drafts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold">{books?.length || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Approvals</CardTitle>
            <CardDescription>Awaiting admin review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-2xl font-bold">{pendingBooks}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Readers</CardTitle>
            <CardDescription>Unique commenters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{totalReaders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Comments</CardTitle>
            <CardDescription>Total reader comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent/10 rounded-full">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold">{comments?.length || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Book Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {approvedBooksList.length > 0 ? (
          <>
            <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 lg:col-span-2">
              <CardHeader>
                <CardTitle>Book Performance</CardTitle>
                <CardDescription>View metrics for your published books</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {approvedBooksList.map((book, index) => {
                    // Calculate a random view count for demonstration
                    const views = Math.floor(Math.random() * 1000) + 100;
                    const totalViews = approvedBooksList.reduce((sum, _, i) => 
                      sum + (Math.floor(Math.random() * 1000) + 100), 0);
                    
                    return (
                      <div key={book.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Link to={`/book/${book.id}`} className="font-medium hover:text-accent">
                            {book.title}
                          </Link>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span>4.5</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-cinematic-text/60">
                          <span>{views} views</span>
                          <span>{Math.round(views / totalViews * 100)}%</span>
                        </div>
                        <Progress 
                          value={views / totalViews * 100} 
                          className="h-2 bg-cinematic-gray/20"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest comments on your books</CardDescription>
              </CardHeader>
              <CardContent>
                {comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="border-b border-cinematic-gray/10 pb-3 last:border-0">
                        <p className="text-sm line-clamp-2 mb-1">{comment.content}</p>
                        <div className="flex justify-between items-center text-xs text-cinematic-text/60">
                          <span>
                            By {comment.profiles?.username || 'Anonymous'}
                          </span>
                          <span>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link to="/writer-dashboard/comments">
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        View All Comments
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-cinematic-text/70">No comments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 lg:col-span-3">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-cinematic-text/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-medium mb-2">No Published Books Yet</h3>
              <p className="text-cinematic-text/70 mb-6 max-w-md mx-auto">
                You don't have any published books yet. Submit your books for review to get them published.
              </p>
              <Link to="/writer-dashboard/add-book">
                <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
                  Add New Book
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default WriterDashboardOverview;
