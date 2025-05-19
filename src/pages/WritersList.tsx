import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Book, Star, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useWriters } from '@/hooks/useProfile';
import { useBooks } from '@/hooks/useBooks';

type Writer = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  bookCount?: number;
  avgRating?: number;
};

const WritersList: React.FC = () => {
  const { data: writers = [], isLoading } = useWriters();
  const { data: allBooks = [] } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWriters, setFilteredWriters] = useState<Writer[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'newest' | 'books' | 'rating'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (writers.length && allBooks.length) {
      const processedWriters = writers.map(writer => {
        const writerBooks = allBooks.filter(book => book.writer_id === writer.id);
        const bookCount = writerBooks.length;
        const avgRating = Math.floor(Math.random() * 5) + 1; // Placeholder
        return { ...writer, bookCount, avgRating };
      });
      setFilteredWriters(processedWriters);
    }
  }, [writers, allBooks]);

  useEffect(() => {
    let result = [...filteredWriters];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(writer =>
        (writer.full_name && writer.full_name.toLowerCase().includes(lowerCaseQuery)) ||
        (writer.username && writer.username.toLowerCase().includes(lowerCaseQuery)) ||
        (writer.bio && writer.bio.toLowerCase().includes(lowerCaseQuery))
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.full_name || a.username || '').localeCompare(b.full_name || b.username || '');
          break;
        case 'newest':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'books':
          comparison = (b.bookCount || 0) - (a.bookCount || 0);
          break;
        case 'rating':
          comparison = (b.avgRating || 0) - (a.avgRating || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredWriters(result);
  }, [searchQuery, sortBy, sortDirection]);

  const handleSort = (type: 'name' | 'newest' | 'books' | 'rating') => {
    if (sortBy === type) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(type);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (type: 'name' | 'newest' | 'books' | 'rating') => {
    if (sortBy !== type) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Writers</h1>
          <p className="text-cinematic-text/70 max-w-2xl mx-auto">
            Discover talented authors from around the world who share their stories on Folio.
          </p>
        </div>

        <div className="bg-cinematic-darker/50 backdrop-blur-sm rounded-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cinematic-text/50" />
              <Input
                placeholder="Search writers by name or bio..."
                className="w-full h-12 pl-10 bg-cinematic-darker/60 border-cinematic-gray/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 min-w-[140px] border-cinematic-gray/30">
                  <Filter className="h-4 w-4 mr-2" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
                {['name', 'newest', 'books', 'rating'].map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleSort(type as any)}
                    className="cursor-pointer flex justify-between"
                  >
                    <span className="capitalize">{type}</span>
                    {getSortIcon(type as any)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Writer Cards */}
        {filteredWriters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <UserCheck className="h-16 w-16 text-cinematic-text/30 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No Writers Found</h3>
            <p className="text-cinematic-text/70 mb-6">
              {searchQuery ? "No writers match your search criteria" : "There are no writers to display at this time."}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline" className="border-cinematic-gray/30">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWriters.map((writer) => (
              <Card key={writer.id} className="border-cinematic-gray/20 bg-cinematic-darker/40 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <Link to={`/writer/${writer.id}`} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={writer.avatar_url || ''} alt={writer.full_name || writer.username} />
                        <AvatarFallback className="bg-accent/20 text-accent text-lg">
                          {(writer.full_name || writer.username || '?')[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-lg truncate">
                          {writer.full_name || writer.username}
                        </h3>
                        {writer.username && (
                          <p className="text-sm text-cinematic-text/70 truncate">@{writer.username}</p>
                        )}
                      </div>
                    </div>

                    {writer.bio && (
                      <p className="text-sm text-cinematic-text/80 line-clamp-3">{writer.bio}</p>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Book className="h-4 w-4 text-accent" />
                        <span>{writer.bookCount || 0} Books</span>
                      </div>

                      <Badge variant="outline" className="flex items-center gap-1 bg-accent/10 text-accent border-accent/20">
                        <Star className="h-3 w-3 fill-accent" />
                        <span>{writer.avgRating || 0}</span>
                      </Badge>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div >
  );
};

export default WritersList;
