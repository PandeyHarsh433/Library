import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, Loader2, AlertTriangle, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMyFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

const Favorites: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: favorites, isLoading } = useMyFavorites();
    const toggleFavorite = useToggleFavorite();

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/favorites' } });
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Will redirect in useEffect
    }

    const handleRemoveFavorite = (bookId: string) => {
        toggleFavorite.mutate({ bookId, isFavorited: true });
    };

    return (
        <div className="pt-16">
            {/* Header Section */}
            <div className="bg-cinematic-darker border-b border-cinematic-gray/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        My Favorite Books
                    </h1>
                    <p className="text-cinematic-text/70 max-w-3xl">
                        Your personal collection of favorite books. Click on any book to view its details or remove it from your favorites.
                    </p>
                </div>
            </div>

            {/* Favorites Content */}
            <div className="bg-cinematic-dark py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                            <span className="ml-2 text-lg">Loading your favorites...</span>
                        </div>
                    ) : favorites && favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites.map((favorite, index) => (
                                <motion.div
                                    key={favorite.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                >
                                    <Card className="overflow-hidden h-full bg-transparent border-cinematic-gray/20 group hover:border-accent/50 transition-all duration-300 book-shadow">
                                        <div className="relative aspect-[2/3] overflow-hidden">
                                            <Link to={`/book/${favorite.book.id}`}>
                                                <img
                                                    src={favorite.book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                                                    alt={favorite.book.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </Link>
                                            <div className="absolute inset-0 bg-gradient-to-t from-cinematic-darker via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Remove button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-cinematic-darker/70 text-cinematic-text hover:text-red-500 hover:bg-cinematic-darker/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                onClick={() => handleRemoveFavorite(favorite.book.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove from favorites</span>
                                            </Button>

                                            {/* Genre badge */}
                                            {favorite.book.genre && favorite.book.genre[0] && (
                                                <Badge className="absolute top-3 left-3 bg-cinematic-darker/80 backdrop-blur-sm text-cinematic-text hover:bg-cinematic-darker">
                                                    {favorite.book.genre[0]}
                                                </Badge>
                                            )}

                                            {/* Heart icon */}
                                            <div className="absolute bottom-3 left-3">
                                                <Heart className="h-5 w-5 text-accent fill-accent" />
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <Link to={`/book/${favorite.book.id}`}>
                                                <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-accent transition-colors line-clamp-1">
                                                    {favorite.book.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-cinematic-text/70 mb-2 line-clamp-1">
                                                by {favorite.book.profiles?.full_name || favorite.book.profiles?.username}
                                            </p>
                                            <ScrollArea className="h-20">
                                                <p className="text-xs text-cinematic-text/60 line-clamp-4">
                                                    {favorite.book.summary}
                                                </p>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mx-auto w-16 h-16 rounded-full bg-cinematic-darker/50 flex items-center justify-center mb-4">
                                <Heart className="h-8 w-8 text-cinematic-text/30" />
                            </div>
                            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
                            <p className="text-cinematic-text/70 max-w-md mx-auto mb-8">
                                You haven't added any books to your favorites yet. Browse our collection and click the heart icon to add books you love.
                            </p>
                            <Link to="/browse">
                                <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
                                    Browse Books
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;