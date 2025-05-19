
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Book, User } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useWriters } from '@/hooks/useProfile';
import { BookWithWriter } from '@/hooks/useBooks';

interface SearchResult {
  id: string;
  title: string;
  type: 'book' | 'writer';
  image?: string | null;
  subtitle?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const { data: books } = useBooks();
  const { data: writers } = useWriters();

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Search in books and writers
    const query = searchQuery.toLowerCase();
    const bookResults: SearchResult[] = (books || [])
      .filter((book: BookWithWriter) =>
        book.title.toLowerCase().includes(query) ||
        book.summary.toLowerCase().includes(query) ||
        (book.genre && book.genre.some(g => g.toLowerCase().includes(query)))
      )
      .map((book: BookWithWriter) => ({
        id: book.id,
        title: book.title,
        type: 'book' as const,
        image: book.cover_image,
        subtitle: book.profiles?.full_name || 'Unknown Author'
      }));

    const writerResults: SearchResult[] = (writers || [])
      .filter(writer =>
        writer.full_name?.toLowerCase().includes(query) ||
        writer.username?.toLowerCase().includes(query) ||
        writer.bio?.toLowerCase().includes(query)
      )
      .map(writer => ({
        id: writer.id,
        title: writer.full_name || writer.username || 'Unknown Writer',
        type: 'writer' as const,
        image: writer.avatar_url,
        subtitle: writer.bio ? writer.bio.substring(0, 60) + '...' : 'Writer'
      }));

    // Combine and limit results
    setResults([...bookResults, ...writerResults].slice(0, 10));
    setIsSearching(false);
  }, [searchQuery, books, writers]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'book') {
      navigate(`/book/${result.id}`);
    } else {
      navigate(`/writer/${result.id}`);
    }
    onClose();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-xl bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-serif">Search</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search books, writers, or genres..."
              className="w-full border-cinematic-gray/30 bg-cinematic-darker/60 focus:border-accent focus:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-cinematic-text/60"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            className="bg-accent text-cinematic-darker hover:bg-accent/90"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-cinematic-text/70">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="font-medium text-sm text-cinematic-text/70 mb-2">Search Results</h3>
            <ul className="space-y-2">
              {results.map((result) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="flex items-center p-2 rounded-md hover:bg-cinematic-darker cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded-md border border-cinematic-gray/20"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-cinematic-gray/10 border border-cinematic-gray/20">
                        {result.type === 'book' ? (
                          <Book className="h-6 w-6 text-cinematic-text/40" />
                        ) : (
                          <User className="h-6 w-6 text-cinematic-text/40" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-accent truncate">{result.title}</div>
                    <div className="text-sm text-cinematic-text/70 truncate">{result.subtitle}</div>
                  </div>
                  <div className="ml-2 px-2 py-1 text-xs rounded-full bg-cinematic-gray/10 border border-cinematic-gray/20">
                    {result.type === 'book' ? 'Book' : 'Writer'}
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <Button
                variant="link"
                className="text-accent"
                onClick={handleSearch}
              >
                View all results
              </Button>
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-cinematic-text/30 mx-auto mb-2" />
            <p className="font-medium">No results found</p>
            <p className="text-sm text-cinematic-text/70 mt-1">Try different keywords or browse our library</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-cinematic-text/30 mx-auto mb-2" />
            <p className="text-sm text-cinematic-text/70">Start typing to search</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
