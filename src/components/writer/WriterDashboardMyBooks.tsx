
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useMyBooks, useDeleteBook } from '@/hooks/useBooks';

const WriterDashboardMyBooks: React.FC = () => {
  const { data: books, isLoading, error } = useMyBooks();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const deleteBook = useDeleteBook();
  
  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      deleteBook.mutate(bookToDelete);
      setBookToDelete(null);
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
          <h1 className="text-3xl font-serif font-bold mb-2">My Books</h1>
          <p className="text-cinematic-text/70">Manage your published books and drafts.</p>
        </div>
        <Link to="/writer-dashboard/add-book">
          <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Book
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading your books...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Books</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading your books. Please try again later.
          </p>
        </div>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-1/3 aspect-[2/3] overflow-hidden">
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-semibold line-clamp-1">{book.title}</h3>
                        <Badge className={`
                          ${book.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                            book.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                            'bg-amber-500/20 text-amber-500'}
                        `}>
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {book.genre.map((genre, index) => (
                          <Badge key={index} variant="outline" className="bg-cinematic-dark/50">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-cinematic-text/70 text-sm line-clamp-2 mb-2">{book.summary}</p>
                      <p className="text-xs text-cinematic-text/50">
                        Created: {new Date(book.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Link to={`/book/${book.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={book.status !== 'pending'}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Dialog open={bookToDelete === book.id} onOpenChange={(open) => {
                        if (!open) setBookToDelete(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setBookToDelete(book.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-cinematic-darker border-cinematic-gray/20">
                          <DialogHeader>
                            <DialogTitle>Delete Book</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this book? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setBookToDelete(null)}>Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDeleteConfirm}
                              disabled={deleteBook.isPending}
                            >
                              {deleteBook.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-cinematic-gray/30 rounded-lg bg-cinematic-darker/20">
          <div className="mb-4">
            <PlusCircle className="h-12 w-12 text-cinematic-text/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No books yet</h3>
          <p className="text-cinematic-text/70 mb-6 max-w-md mx-auto">
            You haven't added any books yet. Start creating your first book to share with the world.
          </p>
          <Link to="/writer-dashboard/add-book">
            <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default WriterDashboardMyBooks;
