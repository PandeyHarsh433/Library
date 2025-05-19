import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Book, Users, Star, Award, BookOpen, MessageSquare,
  Shield, Heart, Share2, Rss, Eye, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const LearnMore: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Welcome to <span className="text-accent">Folio</span>
        </h1>
        <p className="text-xl text-cinematic-text/80 max-w-2xl mx-auto mb-8">
          A digital sanctuary for writers, readers, and storytellers to connect, create, and discover incredible narratives.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
            <Link to="/browse">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Books
            </Link>
          </Button>
          <Button variant="outline" className="border-cinematic-gray/30" asChild>
            <Link to="/register">
              <Users className="h-4 w-4 mr-2" />
              Join Our Community
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="mb-16" />

      {/* About Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">About Folio</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Book className="text-accent mr-2" />
              Our Mission
            </h3>
            <p className="text-cinematic-text/80">
              Folio was created to democratize publishing and give voice to writers of all backgrounds. We believe every story deserves to be told and every voice deserves to be heard. Our platform bridges the gap between writers and readers, creating a vibrant community centered around the love of literature.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Users className="text-accent mr-2" />
              Our Community
            </h3>
            <p className="text-cinematic-text/80">
              At the heart of Folio is our diverse community of passionate readers, talented writers, and dedicated moderators. Together, we've created a space where literary works are celebrated, constructive feedback is offered, and meaningful connections are formed through the shared love of storytelling.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <BookOpen className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Diverse Library</h3>
            <p className="text-cinematic-text/70">
              Explore thousands of books across genres, from established authors to emerging voices, all in one place.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Star className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Ratings & Reviews</h3>
            <p className="text-cinematic-text/70">
              Share your thoughts on books you've read and discover new favorites through community recommendations.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MessageSquare className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Writer Feedback</h3>
            <p className="text-cinematic-text/70">
              Connect directly with readers through comments and gain valuable insights to improve your craft.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Moderation</h3>
            <p className="text-cinematic-text/70">
              Our dedicated team ensures that content remains high-quality and that community interactions are respectful.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Writer Tools</h3>
            <p className="text-cinematic-text/70">
              Comprehensive dashboard for writers to publish, manage, and promote their work to a global audience.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Share2 className="text-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Social Sharing</h3>
            <p className="text-cinematic-text/70">
              Easily share your favorite books and authors across your social networks with our integrated sharing tools.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">What Our Community Says</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-cinematic-darker/20 p-6 rounded-lg border border-cinematic-gray/20">
            <p className="text-cinematic-text/80 italic mb-4">
              "Folio has transformed my reading experience. I've discovered so many incredible books and authors I wouldn't have found otherwise. The community discussions add another dimension to my reading."
            </p>
            <div className="flex items-center">
              <div className="mr-3 bg-accent/20 w-10 h-10 rounded-full flex items-center justify-center text-accent font-medium">ER</div>
              <div>
                <h4 className="font-medium">Emily Rodriguez</h4>
                <p className="text-sm text-cinematic-text/60">Avid Reader</p>
              </div>
            </div>
          </div>

          <div className="bg-cinematic-darker/20 p-6 rounded-lg border border-cinematic-gray/20">
            <p className="text-cinematic-text/80 italic mb-4">
              "As an independent writer, Folio gave me a platform to share my stories and connect with readers from around the world. The feedback I've received has been invaluable to my growth as an author."
            </p>
            <div className="flex items-center">
              <div className="mr-3 bg-accent/20 w-10 h-10 rounded-full flex items-center justify-center text-accent font-medium">JK</div>
              <div>
                <h4 className="font-medium">James Kim</h4>
                <p className="text-sm text-cinematic-text/60">Published Author</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-accent/10 p-8 rounded-lg border border-accent/20 mb-8">
        <h2 className="text-2xl font-serif font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-cinematic-text/80 max-w-2xl mx-auto mb-6">
          Join our growing community of readers and writers today. Whether you're here to discover your next favorite book or share your stories with the world, Folio is the perfect place for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-accent text-cinematic-darker hover:bg-accent/90" asChild>
            <Link to="/register">Create an Account</Link>
          </Button>
          <Button variant="outline" className="border-cinematic-gray/30" asChild>
            <Link to="/browse">Explore the Library</Link>
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <h3 className="text-xl font-medium mb-2">Is Folio free to use?</h3>
            <p className="text-cinematic-text/70">
              Yes, Folio is completely free for both readers and writers. We believe in making literature accessible to everyone.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <h3 className="text-xl font-medium mb-2">How do I become a writer on Folio?</h3>
            <p className="text-cinematic-text/70">
              Simply create an account and request writer access from your profile settings. Once approved, you'll have access to our writer dashboard where you can publish your works.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <h3 className="text-xl font-medium mb-2">What types of content are allowed?</h3>
            <p className="text-cinematic-text/70">
              Folio welcomes all genres and styles of writing, but we maintain community guidelines to ensure content is appropriate. All submissions go through a moderation process.
            </p>
          </div>

          <div className="bg-cinematic-darker/30 p-6 rounded-lg border border-cinematic-gray/20">
            <h3 className="text-xl font-medium mb-2">Can I promote my published books from other platforms?</h3>
            <p className="text-cinematic-text/70">
              Absolutely! Many authors use Folio to build their audience and promote works published elsewhere. You can include links to purchase your books on other platforms.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearnMore;
