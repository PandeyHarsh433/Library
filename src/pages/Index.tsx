import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ChevronRight, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import FeaturedBooks from '@/components/FeaturedBooks';
import SearchModal from '@/components/SearchModal';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Mock data for featured genres - would come from API in full implementation
  const featuredGenres = [
    { id: 1, name: 'Mystery', image: 'https://images.unsplash.com/photo-1475088092121-b7d3cd6e1482?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { id: 2, name: 'Fantasy', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { id: 3, name: 'Romance', image: 'https://images.unsplash.com/photo-1516486392848-8b67ef89f113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { id: 4, name: 'Drama', image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  ];

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <div ref={targetRef} className="relative min-h-screen flex flex-col justify-center items-center text-center pt-24 pb-32">
        <motion.div
          style={{ opacity, y }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold mb-6 text-shadow animate-text-focus"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Discover Stories That <span className="text-accent">Illuminate</span> The Soul
          </motion.h1>
          <motion.p
            className="text-xl text-cinematic-text/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore our curated collection of literary masterpieces that transport you into worlds crafted with emotional depth and artistic vision.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="max-w-lg mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search books, writers, or genres..."
                className="w-full h-12 pl-4 pr-12 text-base rounded-full border-cinematic-gray/30 bg-cinematic-darker/60 backdrop-blur-lg focus:border-accent focus:ring-accent"
                onClick={openSearchModal}
                readOnly
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 bottom-1 rounded-full bg-accent text-cinematic-darker hover:bg-accent/90"
                onClick={openSearchModal}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link to="/browse">
              <Button className="bg-accent text-cinematic-darker hover:bg-accent/90 px-6 py-5 text-base sm:text-lg">
                Explore Library
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to={user ? "/browse" : "/register"}>
              <Button variant="outline" className="border-cinematic-gray/70 text-cinematic-text hover:border-accent hover:text-accent px-6 py-5 text-base sm:text-lg">
                {user ? "Discover Books" : "Join Folio"}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-cinematic-darker/40 to-cinematic-dark z-0"></div>

        {/* Hero background image */}
        <div className="absolute inset-0 overflow-hidden z-[-1]">
          <img
            src="https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Library shelves with books"
            className="w-full h-full object-cover opacity-30 filter brightness-50 contrast-125 saturate-50"
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-cinematic-text/30 flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-cinematic-text/30 rounded-full mt-2"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Featured Books Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Books</h2>
              <p className="text-cinematic-text/80 max-w-2xl">Curated selections that represent the pinnacle of literary craftsmanship and emotional resonance.</p>
            </div>
            <Link to="/browse" className="mt-4 md:mt-0 group inline-flex items-center text-accent hover:text-accent/80 transition-colors">
              <span>View all books</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <FeaturedBooks />
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-20 bg-cinematic-darker/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center">Explore Genres</h2>
          <p className="text-cinematic-text/80 max-w-2xl mx-auto text-center mb-12">Discover new worlds through our diverse collection of literary genres.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGenres.map((genre) => (
              <Link key={genre.id} to={`/browse?genre=${genre.name.toLowerCase()}`}>
                <Card className="group overflow-hidden relative h-64 border-0 rounded-lg book-shadow">
                  <div className="absolute inset-0">
                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white">{genre.name}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Writer Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Share Your Story With The World</h2>
              <p className="text-cinematic-text/80 mb-8">Join our community of writers and share your literary creations with passionate readers. Gain exposure, receive feedback, and connect with fellow storytellers.</p>
              <div className="flex flex-wrap gap-4">
                <Link to={user ? "/writer-application" : "/register"}>
                  <Button className="bg-accent text-cinematic-darker hover:bg-accent/90">
                    Become a Writer
                  </Button>
                </Link>
                <Link to="/learn-more">
                  <Button variant="outline" className="border-cinematic-gray/70 text-cinematic-text hover:border-accent hover:text-accent">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
                <Card className="glass-card overflow-hidden relative p-8 rounded-lg book-shadow">
                  <div className="flex items-start mb-6">
                    <div className="mr-4 bg-accent/20 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold">Writer Benefits</h3>
                      <p className="text-cinematic-text/70 text-sm">Connect with readers worldwide</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span>Professional profile to showcase your works</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span>Analytics on reader engagement with your stories</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span>Community of fellow writers for collaboration</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span>Exposure to literary agents and publishers</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Index;