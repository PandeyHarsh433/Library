
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, BookOpen, MessageSquare, Share2, ChevronRight, ArrowLeft, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBook, useBooksByGenre } from '@/hooks/useBooks';
import { useBookComments, useAddComment } from '@/hooks/useComments';
import { useBookAverageRating, useMyRating, useAddRating } from '@/hooks/useRatings';
import { useIsFavorited, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import ShareModal from '@/components/ShareModal';
import ReadNowModal from '@/components/ReadNowModal';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReadNowModalOpen, setIsReadNowModalOpen] = useState(false);

  const { user } = useAuth();

  // Fetch book data
  const { data: book, isLoading: isLoadingBook, error: bookError } = useBook(id);

  // Fetch comments
  const { data: comments, isLoading: isLoadingComments } = useBookComments(id);

  // Fetch ratings
  const { averageRating, ratingCount } = useBookAverageRating(id);
  const { data: myRating } = useMyRating(id);

  // Favorites
  const { data: isFavorited } = useIsFavorited(id);
  const toggleFavorite = useToggleFavorite();

  // Related books by first genre
  const firstGenre = book?.genre?.[0];
  const { data: relatedBooks } = useBooksByGenre(firstGenre || '');

  // Mutations
  const addComment = useAddComment();
  const addRating = useAddRating();

  // Handle rating submission
  const handleRatingSubmit = () => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${id}` } });
      return;
    }

    if (selectedRating === 0) return;

    addRating.mutate({
      bookId: id!,
      rating: selectedRating
    });
  };

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${id}` } });
      return;
    }

    toggleFavorite.mutate({
      bookId: id!,
      isFavorited: !!isFavorited
    });
  };

  // Handle share modal open/close
  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Handle read now modal open/close
  const handleOpenReadNowModal = () => {
    setIsReadNowModalOpen(true);
  };

  const handleCloseReadNowModal = () => {
    setIsReadNowModalOpen(false);
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${id}` } });
      return;
    }

    if (newComment.trim() === '') return;

    addComment.mutate({
      bookId: id!,
      content: newComment
    }, {
      onSuccess: () => setNewComment('')
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const shareUrl = `${window.location.origin}/book/${id}`;

  if (isLoadingBook) {
    return (
      <div className="pt-16">
        <div className="bg-cinematic-darker py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <Skeleton className="w-full aspect-[2/3] rounded-lg" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="flex items-center mb-6">
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-24 w-full mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-[70vh]">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
        <p className="text-cinematic-text/70 mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse">
          <Button>Browse Books</Button>
        </Link>
      </div>
    );
  }

  // Filter out the current book from related books
  const filteredRelatedBooks = relatedBooks?.filter(relatedBook => relatedBook.id !== book.id).slice(0, 4);

  return (
    <div className="pt-16">
      {/* Navigation breadcrumb */}
      <div className="bg-cinematic-darker border-b border-cinematic-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-cinematic-text/70">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/browse" className="hover:text-accent transition-colors">Browse</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-cinematic-text/90">{book.title}</span>
          </div>
        </div>
      </div>

      {/* Book Header Section */}
      <div className="relative bg-cinematic-darker overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
            alt={book.title}
            className="w-full h-full object-cover blur-md"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cinematic-darker to-cinematic-dark"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Book Cover */}
            <motion.div
              className="w-full md:w-1/3 lg:w-1/4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg book-shadow">
                <img
                  src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 flex justify-center space-x-2">
                <Button
                  variant="default"
                  className="bg-accent text-cinematic-darker hover:bg-accent/90 flex-1"
                  onClick={handleOpenReadNowModal}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Now
                </Button>
                <Button
                  variant="outline"
                  className={`border-cinematic-gray/30 hover:border-accent ${isFavorited ? 'text-accent border-accent' : 'text-cinematic-text'}`}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-accent' : ''}`} />
                  <span className="sr-only">{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenShareModal}
                  className="border-cinematic-gray/30 text-cinematic-text hover:border-accent hover:text-accent"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </motion.div>

            {/* Book Details */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-3 bg-accent/20 text-accent hover:bg-accent/30 uppercase tracking-wide">
                  {book.genre[0]}
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 text-shadow">
                  {book.title}
                </h1>
                <Link to={`/writer/${book.writer_id}`} className="inline-block mb-4 text-lg text-cinematic-text/90 hover:text-accent transition-colors">
                  by {book.profiles?.full_name || book.profiles?.username}
                </Link>

                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'text-accent fill-accent' : i < averageRating ? 'text-accent fill-accent/50' : 'text-cinematic-gray/30'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-cinematic-text/90">{averageRating}</span>
                  <span className="ml-1 text-cinematic-text/70">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                </div>

                <p className="text-lg leading-relaxed mb-6 text-cinematic-text/90">
                  {book.summary}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <h3 className="text-sm text-cinematic-text/70 mb-1">Published</h3>
                    <p className="font-medium">{formatDate(book.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-cinematic-text/70 mb-1">Genres</h3>
                    <div className="flex flex-wrap gap-1">
                      {book.genre.map((g) => (
                        <span key={g} className="font-medium">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-cinematic-text/70 mb-1">Status</h3>
                    <p className="font-medium capitalize">{book.status}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link to={`/writer/${book.writer_id}`}>
                    <Button variant="outline" className="border-cinematic-gray/30 text-cinematic-text hover:border-accent hover:text-accent">
                      <User className="h-4 w-4 mr-2" />
                      Writer Profile
                    </Button>
                  </Link>
                  <Link to="/browse">
                    <Button variant="outline" className="border-cinematic-gray/30 text-cinematic-text hover:border-accent hover:text-accent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Browse
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        title={book.title}
        url={shareUrl}
        type="book"
      />

      <ReadNowModal
        isOpen={isReadNowModalOpen}
        onClose={handleCloseReadNowModal}
        bookTitle={book.title}
      />

      {/* Book Content Tabs */}
      <div className="bg-cinematic-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8 bg-cinematic-darker/50 border border-cinematic-gray/30">
              <TabsTrigger value="description" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Description
              </TabsTrigger>
              <TabsTrigger value="writer" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Writer
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 book-shadow">
                <CardContent className="p-6 sm:p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <p>{book.summary}</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="writer" className="mt-0">
              <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 book-shadow">
                <CardContent className="p-6 sm:p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-start gap-8"
                  >
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                      <div className="aspect-square overflow-hidden rounded-lg mb-4">
                        <img
                          src={book.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.profiles?.full_name || book.profiles?.username || 'Unknown')}&background=random`}
                          alt={book.profiles?.full_name || book.profiles?.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Link to={`/writer/${book.writer_id}`}>
                        <Button className="w-full bg-accent text-cinematic-darker hover:bg-accent/90">
                          View Profile
                        </Button>
                      </Link>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-serif font-bold mb-4">{book.profiles?.full_name || book.profiles?.username}</h2>
                      <p className="text-cinematic-text/90 mb-6">{book.profiles?.bio || 'No bio available.'}</p>

                      {filteredRelatedBooks && filteredRelatedBooks.length > 0 && (
                        <>
                          <h3 className="text-lg font-medium mb-3">Other Books by {book.profiles?.full_name || book.profiles?.username}</h3>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredRelatedBooks.map((relatedBook) => (
                              <Link key={relatedBook.id} to={`/book/${relatedBook.id}`}>
                                <div className="group">
                                  <div className="aspect-[2/3] overflow-hidden rounded-md mb-2">
                                    <img
                                      src={relatedBook.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                                      alt={relatedBook.title}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                  <h4 className="text-sm font-medium line-clamp-1 group-hover:text-accent transition-colors">{relatedBook.title}</h4>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 book-shadow">
                <CardContent className="p-6 sm:p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Leave a rating */}
                    <div className="mb-8">
                      <h3 className="text-xl font-serif font-bold mb-4">Rate this Book</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setSelectedRating(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${myRating?.rating >= rating || selectedRating >= rating
                                ? 'text-accent fill-accent'
                                : 'text-cinematic-gray/30'
                                } cursor-pointer hover:text-accent/70 transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={handleRatingSubmit}
                        disabled={selectedRating === 0 && !myRating}
                        className="bg-accent text-cinematic-darker hover:bg-accent/90"
                      >
                        {myRating ? 'Update Rating' : 'Submit Rating'}
                      </Button>
                    </div>

                    <Separator className="mb-8 bg-cinematic-gray/20" />

                    {/* Add a comment */}
                    <div className="mb-8">
                      <h3 className="text-xl font-serif font-bold mb-4">Leave a Comment</h3>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        className="min-h-[120px] bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent mb-4"
                      />
                      <Button
                        onClick={handleCommentSubmit}
                        disabled={newComment.trim() === ''}
                        className="bg-accent text-cinematic-darker hover:bg-accent/90"
                      >
                        Post Comment
                      </Button>
                    </div>

                    <Separator className="mb-8 bg-cinematic-gray/20" />

                    {/* Comments */}
                    <h3 className="text-xl font-serif font-bold mb-6">
                      Reader Comments ({isLoadingComments ? '...' : comments?.length || 0})
                    </h3>

                    {isLoadingComments ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-cinematic-dark/50 rounded-lg p-4 border border-cinematic-gray/10">
                            <div className="flex items-start">
                              <Skeleton className="h-10 w-10 rounded-full mr-4" />
                              <div className="flex-1">
                                <Skeleton className="h-5 w-1/4 mb-2" />
                                <Skeleton className="h-4 w-1/3 mb-3" />
                                <Skeleton className="h-16 w-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : comments && comments.length > 0 ? (
                      <div className="space-y-6">
                        {comments.map((comment) => (
                          <div key={comment.id} className="bg-cinematic-dark/50 rounded-lg p-4 border border-cinematic-gray/10">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={comment.profiles?.avatar_url || undefined} alt={comment.profiles?.username || 'User'} />
                                <AvatarFallback>
                                  {(comment.profiles?.username || 'U').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{comment.profiles?.username || 'Anonymous'}</h4>
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-cinematic-text/60">
                                        {formatDate(comment.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-3 text-cinematic-text/90">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-cinematic-text/70">No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Books */}
      {filteredRelatedBooks && filteredRelatedBooks.length > 0 && (
        <section className="py-12 bg-cinematic-darker">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredRelatedBooks.map((relatedBook) => (
                <motion.div
                  key={relatedBook.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/book/${relatedBook.id}`}>
                    <Card className="group overflow-hidden h-full bg-transparent border-cinematic-gray/20 hover:border-accent/50 transition-all duration-300 book-shadow hover:shadow-accent/5">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={relatedBook.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                          alt={relatedBook.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {relatedBook.genre && relatedBook.genre[0] && (
                          <Badge className="absolute top-3 right-3 bg-cinematic-darker/80 backdrop-blur-sm text-cinematic-text hover:bg-cinematic-darker">
                            {relatedBook.genre[0]}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-accent transition-colors line-clamp-1">
                          {relatedBook.title}
                        </h3>
                        <p className="text-sm text-cinematic-text/70 mb-2">
                          by {relatedBook.profiles?.full_name || relatedBook.profiles?.username}
                        </p>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? 'text-accent fill-accent' : 'text-cinematic-gray/30'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetails;
