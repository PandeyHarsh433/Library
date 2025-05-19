
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Search, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useWriterComments, useDeleteComment } from '@/hooks/useComments';
import { useMyBooks } from '@/hooks/useBooks';

const WriterDashboardComments: React.FC = () => {
  const { user } = useAuth();
  const { data: comments, isLoading, error } = useWriterComments(user?.id);
  const { data: books } = useMyBooks();
  const deleteComment = useDeleteComment();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [commentToDelete, setCommentToDelete] = useState<{id: string, bookId: string} | null>(null);
  
  // Filter comments based on search and book selection
  const filteredComments = comments?.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBook = selectedBook === 'all' || comment.book_id === selectedBook;
    
    return matchesSearch && matchesBook;
  });
  
  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      deleteComment.mutate({
        commentId: commentToDelete.id,
        bookId: commentToDelete.bookId
      }, {
        onSuccess: () => setCommentToDelete(null)
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Reader Comments</h1>
          <p className="text-cinematic-text/70">View and moderate comments on your books.</p>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-cinematic-text/50 hover:text-cinematic-text"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30">
              <SelectValue placeholder="Filter by book" />
            </SelectTrigger>
            <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
              <SelectItem value="all">All Books</SelectItem>
              {books?.map(book => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading comments...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Comments</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading the comments. Please try again later.
          </p>
        </div>
      ) : filteredComments && filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => {
            // Find the book this comment belongs to
            const book = books?.find(b => b.id === comment.book_id);
            
            return (
              <Card key={comment.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                          <AvatarFallback>
                            {(comment.profiles?.username?.[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.profiles?.username || 'Anonymous'}</p>
                          <p className="text-xs text-cinematic-text/60">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link to={`/book/${comment.book_id}`} className="flex items-center text-sm text-accent hover:underline">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {book?.title || 'Unknown Book'}
                      </Link>
                    </div>
                    
                    <div className="flex-1">
                      <div className="relative bg-cinematic-dark/30 rounded-lg p-4 mb-3">
                        <div className="absolute top-0 left-4 transform -translate-y-1/2 rotate-45 w-3 h-3 bg-cinematic-dark/30"></div>
                        <p className="text-cinematic-text/90">{comment.content}</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Dialog open={commentToDelete?.id === comment.id} onOpenChange={(open) => {
                          if (!open) setCommentToDelete(null);
                        }}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => setCommentToDelete({ id: comment.id, bookId: comment.book_id })}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          
                          <DialogContent className="bg-cinematic-darker border-cinematic-gray/20">
                            <DialogHeader>
                              <DialogTitle>Delete Comment</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this comment? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setCommentToDelete(null)}>Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={handleDeleteConfirm}
                                disabled={deleteComment.isPending}
                              >
                                {deleteComment.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-cinematic-gray/30 rounded-lg bg-cinematic-darker/20">
          <div className="mb-4">
            <MessageSquare className="h-12 w-12 text-cinematic-text/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No comments found</h3>
          <p className="text-cinematic-text/70 max-w-md mx-auto">
            {searchQuery || selectedBook !== 'all' 
              ? 'No comments match your search criteria. Try adjusting your filters.'
              : 'You don\'t have any comments on your books yet. Once readers start commenting, they\'ll appear here.'}
          </p>
          {(searchQuery || selectedBook !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedBook('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WriterDashboardComments;
