import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, AlertTriangle, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserProfile } from '@/hooks/useProfile';
import { useWriterBooks } from '@/hooks/useBooks';
import { useWriterComments } from '@/hooks/useComments';
import ContactWriterModal from '@/components/ContactWriterModal';

const WriterProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useUserProfile(id);
  const { data: books, isLoading: isLoadingBooks } = useWriterBooks(id);
  const { data: comments, isLoading: isLoadingComments } = useWriterComments(id);

  if (isLoadingProfile) {
    return (
      <div className="pt-16">
        <div className="bg-cinematic-darker py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full mb-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-[70vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Writer Not Found</h1>
        <p className="text-cinematic-text/70 mb-6">The writer profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse">
          <Button>Browse Books</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Header Section */}
      <div className="relative bg-cinematic-darker overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cinematic-darker to-cinematic-dark"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Writer Avatar */}
            <motion.div
              className="w-full md:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square overflow-hidden rounded-lg book-shadow bg-cinematic-dark/50 border border-cinematic-gray/20">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username || 'Unknown')}&background=random`}
                  alt={profile.full_name || profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                className="w-full mt-4 bg-accent text-cinematic-darker hover:bg-accent/90 flex items-center justify-center"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Writer
              </Button>
            </motion.div>

            {/* Writer Details */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-3 bg-accent/20 text-accent hover:bg-accent/30 uppercase tracking-wide">
                  {profile.role === 'writer' ? 'Writer' : profile.role === 'admin' ? 'Admin' : 'Reader'}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-shadow">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-lg text-cinematic-text/90 mb-6">@{profile.username}</p>

                <p className="text-cinematic-text/90 leading-relaxed">
                  {profile.bio || 'This writer has not added a bio yet.'}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-accent mr-2" />
                    <span>{isLoadingBooks ? '...' : books?.length || 0} Published Books</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-cinematic-dark py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8 bg-cinematic-darker/50 border border-cinematic-gray/30">
              <TabsTrigger value="books" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Published Books
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Recent Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="mt-0">
              {isLoadingBooks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                  ))}
                </div>
              ) : books && books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <Link to={`/book/${book.id}`}>
                        <Card className="group overflow-hidden h-full bg-transparent border-cinematic-gray/20 hover:border-accent/50 transition-all duration-300 book-shadow hover:shadow-accent/5">
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <img
                              src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                              alt={book.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinematic-darker via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {book.genre && book.genre[0] && (
                              <Badge className="absolute top-3 right-3 bg-cinematic-darker/80 backdrop-blur-sm text-cinematic-text hover:bg-cinematic-darker">
                                {book.genre[0]}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-xl font-serif font-semibold mb-1 group-hover:text-accent transition-colors line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-cinematic-text/70 line-clamp-2 min-h-[2.5rem]">
                              {book.summary?.substring(0, 80)}...
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-12 w-12 text-cinematic-text/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-medium mb-2">No books published yet</h3>
                  <p className="text-cinematic-text/70 max-w-md mx-auto">
                    This writer hasn't published any books yet. Check back later for updates.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              {isLoadingComments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <Card className="bg-cinematic-darker/30 border-cinematic-gray/20">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-2">
                                <Link to={`/book/${comment.book_id}`} className="font-semibold text-accent hover:underline">
                                  {comment.books?.title}
                                </Link>
                                <span className="text-sm text-cinematic-text/60">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-cinematic-text/90">{comment.content}</p>
                              <div className="mt-2 text-sm">
                                <span className="text-cinematic-text/60">Commented by </span>
                                <span className="text-cinematic-text/90">{comment.profiles?.username || 'Anonymous'}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare className="h-12 w-12 text-cinematic-text/30 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-medium mb-2">No comments yet</h3>
                  <p className="text-cinematic-text/70 max-w-md mx-auto">
                    There are no comments on this writer's books yet. Be the first to leave a comment!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Contact Writer Modal */}
      <ContactWriterModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        writerName={profile.full_name || profile.username || 'Writer'}
      />
    </div>
  );
};

export default WriterProfile;
