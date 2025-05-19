
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, ChevronDown, X, Trash2, Edit, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useBooks, useDeleteBook } from '@/hooks/useBooks';

const AdminDashboardBooks: React.FC = () => {
  const { data: books, isLoading, error } = useBooks();
  const deleteBook = useDeleteBook();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  
  // Get unique genres from all books
  const allGenres = books ? Array.from(new Set(books.flatMap(book => book.genre))) : [];
  
  // Filter books based on search and filters
  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    const matchesGenre = genreFilter === 'all' || book.genre.includes(genreFilter);
    
    return matchesSearch && matchesStatus && matchesGenre;
  });
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenreFilter('all');
  };
  
  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      deleteBook.mutate(bookToDelete, {
        onSuccess: () => setBookToDelete(null)
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
      <h1 className="text-3xl font-serif font-bold mb-2">Book Management</h1>
      <p className="text-cinematic-text/70 mb-6">Manage all books in the platform library.</p>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search books, writers..."
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
          
          <Button
            variant="outline"
            size="sm"
            className={`border-cinematic-gray/30 ${showFilters ? 'text-accent border-accent' : 'text-cinematic-text'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filter Panel */}
        <motion.div 
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden ${showFilters ? 'mt-4 pb-2' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
                  <SelectItem value="all">All Genres</SelectItem>
                  {allGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="text-cinematic-text/70 hover:text-accent"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading books...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Books</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading the books. Please try again later.
          </p>
        </div>
      ) : filteredBooks && filteredBooks.length > 0 ? (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/5 lg:w-1/6 aspect-[2/3] sm:aspect-auto">
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-serif font-semibold mb-1">{book.title}</h3>
                        <Link to={`/writer/${book.writer_id}`} className="text-sm text-accent hover:underline mb-2 inline-block">
                          by {book.profiles?.full_name || book.profiles?.username}
                        </Link>
                      </div>
                      <Badge className={`
                        ${book.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                          book.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                          'bg-amber-500/20 text-amber-500'}
                      `}>
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
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
                    
                    <div className="flex items-center text-sm text-cinematic-text/60 mb-4">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>Added on {new Date(book.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-end">
                      <Link to={`/book/${book.id}`} className="mr-2">
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Dialog open={bookToDelete === book.id} onOpenChange={(open) => {
                        if (!open) setBookToDelete(null);
                      }}>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setBookToDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        
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
            <BookOpen className="h-12 w-12 text-cinematic-text/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No books found</h3>
          <p className="text-cinematic-text/70 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || genreFilter !== 'all'
              ? 'No books match your search criteria. Try adjusting your filters.'
              : 'There are no books in the library yet.'}
          </p>
          {(searchQuery || statusFilter !== 'all' || genreFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboardBooks;
