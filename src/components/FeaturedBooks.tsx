
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/hooks/useBooks';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeaturedBooks: React.FC = () => {
  const { data: books, isLoading, error } = useBooks();
  
  // Take the first 4 books for featured section
  const featuredBooks = books?.slice(0, 4);
  
  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={i} variants={item}>
            <Skeleton className="aspect-[2/3] rounded-lg" />
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  if (error || !featuredBooks || featuredBooks.length === 0) {
    return (
      <div className="text-center py-8">
        {error ? (
          <p className="text-red-500">Failed to load featured books</p>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-accent" />
            <p>No featured books available</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {featuredBooks.map((book) => (
        <motion.div key={book.id} variants={item}>
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
                <Link to={`/writer/${book.writer_id}`}>
                  <p className="text-sm text-cinematic-text/70 mb-2 hover:text-accent transition-colors">
                    by {book.profiles?.full_name || book.profiles?.username}
                  </p>
                </Link>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedBooks;
