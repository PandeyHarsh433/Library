
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBooks, BookWithWriter } from '@/hooks/useBooks';

const BrowseBooks: React.FC = () => {
  const location = useLocation();
  const { data: books, isLoading } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<BookWithWriter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('latest');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  
  // Extract search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const genreParam = params.get('genre');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (genreParam) {
      setGenre(genreParam);
      setSelectedGenres(genreParam.split(','));
    }
  }, [location.search]);
  
  // Extract all unique genres from books
  useEffect(() => {
    if (books) {
      const genres = books.reduce((acc: string[], book: BookWithWriter) => {
        if (book.genre && Array.isArray(book.genre)) {
          book.genre.forEach((g) => {
            if (!acc.includes(g)) {
              acc.push(g);
            }
          });
        }
        return acc;
      }, []);
      
      setAllGenres(genres.sort());
    }
  }, [books]);
  
  // Filter and sort books based on search, genre, and sort criteria
  useEffect(() => {
    if (!books) return;
    
    let filtered = [...books];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.summary.toLowerCase().includes(query) ||
          (book.genre && book.genre.some((g) => g.toLowerCase().includes(query))) ||
          book.profiles?.full_name?.toLowerCase().includes(query) ||
          book.profiles?.username?.toLowerCase().includes(query)
      );
    }
    
    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((book) =>
        book.genre && book.genre.some((g) => selectedGenres.includes(g))
      );
    }
    
    // Apply sorting
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedGenres, sortBy]);
  
  const handleGenreSelect = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-6 pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Browse Books</h1>
            <p className="text-cinematic-text/70">
              Discover your next literary journey from our collection
            </p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-cinematic-darker/50 backdrop-blur-sm rounded-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, genre, or author..."
                className="w-full h-12 pl-10"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-cinematic-text/50" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 min-w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    Genres
                    {selectedGenres.length > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs text-white">
                        {selectedGenres.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px] max-h-[400px] overflow-auto">
                  <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allGenres.map((genre) => (
                    <DropdownMenuCheckboxItem
                      key={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="h-12 min-w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
              
              {(searchQuery || selectedGenres.length > 0) && (
                <Button
                  variant="ghost"
                  className="h-12"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Active filters display */}
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedGenres.map((genre) => (
                <div
                  key={genre}
                  className="flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                  <button
                    onClick={() => handleGenreSelect(genre)}
                    className="ml-1.5 p-0.5 hover:bg-accent/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Books grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`}>
                <Card className="h-full group overflow-hidden hover:border-accent/50 transition-all duration-200 book-shadow border-cinematic-gray/10 bg-cinematic-darker/50">
                  <div className="aspect-[2/3] overflow-hidden relative">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cinematic-gray/10">
                        <BookOpen className="h-12 w-12 text-cinematic-text/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-serif font-bold truncate group-hover:text-accent transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-cinematic-text/70">
                      By {book.profiles?.full_name || book.profiles?.username || 'Unknown Author'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.genre?.slice(0, 2).map((g, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 bg-cinematic-gray/10 rounded-full"
                        >
                          {g}
                        </span>
                      ))}
                      {book.genre && book.genre.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-cinematic-gray/10 rounded-full">
                          +{book.genre.length - 2}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-cinematic-text/20 mb-4" />
            <h3 className="text-xl font-serif font-medium mb-2">No Books Found</h3>
            <p className="text-cinematic-text/70 max-w-md mx-auto">
              We couldn't find any books matching your search criteria. Please try a different search or browse our full collection.
            </p>
            <Button
              className="mt-6 bg-accent text-cinematic-darker hover:bg-accent/90"
              onClick={clearFilters}
            >
              View All Books
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrowseBooks;
