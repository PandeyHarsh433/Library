
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Instagram, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-cinematic-darker border-t border-cinematic-gray/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-accent mr-2" />
              <span className="text-2xl font-serif font-bold text-gradient">Folio</span>
            </Link>
            <p className="mt-4 text-sm text-cinematic-text/80">
              A cinematic library experience inspired by the atmospheric aesthetic of A24 films.
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-serif font-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/writers" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Writers
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-serif font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/writer-application" className="text-cinematic-text/80 hover:text-accent transition-colors">
                  Become a Writer
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-serif font-medium mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-cinematic-text hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-cinematic-text hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-cinematic-text hover:text-accent transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cinematic-gray/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-cinematic-text/60">
            © {new Date().getFullYear()} Folio Library. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-sm text-cinematic-text/60 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-cinematic-text/60 hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
