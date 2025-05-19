
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMyBooks } from '@/hooks/useBooks';

const WriterDashboardPendingBooks: React.FC = () => {
  const { data: books, isLoading, error } = useMyBooks();
  
  // Filter for pending books
  const pendingBooks = books?.filter(book => book.status === 'pending');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-serif font-bold mb-2">Pending Approvals</h1>
      <p className="text-cinematic-text/70 mb-8">Track books waiting for admin approval.</p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading pending books...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Books</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading your books. Please try again later.
          </p>
        </div>
      ) : pendingBooks && pendingBooks.length > 0 ? (
        <div className="space-y-6">
          {pendingBooks.map((book) => (
            <Card key={book.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 lg:w-1/6 aspect-[2/3] sm:aspect-auto">
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-serif font-semibold">{book.title}</h3>
                          <Badge className="bg-amber-500/20 text-amber-500">
                            Pending
                          </Badge>
                        </div>
                        
                        <div className="mb-3 flex flex-wrap gap-1">
                          {book.genre.map((genre, index) => (
                            <Badge key={index} variant="outline" className="bg-cinematic-dark/50">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-cinematic-text/70 text-sm mb-4">{book.summary.substring(0, 150)}...</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-cinematic-text/70">Approval Status</span>
                            <span className="text-amber-500">In Review</span>
                          </div>
                          <Progress value={33} className="h-2 bg-cinematic-gray/20" />
                        </div>
                        
                        <div className="flex items-center text-sm text-cinematic-text/60 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Submitted on {new Date(book.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-auto pt-3 border-t border-cinematic-gray/10">
                        <Link to={`/book/${book.id}`}>
                          <Button size="sm" variant="outline">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-cinematic-gray/30 rounded-lg bg-cinematic-darker/20">
          <div className="mb-4">
            <Clock className="h-12 w-12 text-cinematic-text/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No pending books</h3>
          <p className="text-cinematic-text/70 mb-6 max-w-md mx-auto">
            You don't have any books awaiting approval. Add a new book to get started.
          </p>
          <Link to="/writer-dashboard/add-book">
            <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
              Add New Book
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default WriterDashboardPendingBooks;
