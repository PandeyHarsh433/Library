
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample review data
const reviews = [
  {
    id: 1,
    name: "Emily Johnson",
    role: "Regular Reader",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    review: "Lumina has completely transformed my reading experience. I've discovered so many incredible books that I wouldn't have found otherwise.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Aspiring Writer",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    review: "As a new writer, finding a platform that values quality storytelling has been incredible. The feedback from readers has helped me grow tremendously.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Book Club Organizer",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    review: "Our book club exclusively uses Lumina to find our monthly reads. The diversity of voices and genres available is unmatched anywhere else.",
    rating: 4,
  },
  {
    id: 4,
    name: "James Rodriguez",
    role: "Published Author",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    review: "Lumina provides an excellent platform for connecting directly with readers. The community here is engaged and passionate about literature.",
    rating: 5,
  }
];

const SiteReviews: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">What Our Community Says</h2>
          <p className="text-cinematic-text/70 max-w-2xl mx-auto">
            Join thousands of readers and writers who have found their literary home on Lumina.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-cinematic-darker/30 border border-cinematic-gray/20 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="bg-accent/20 text-accent">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{review.name}</h3>
                    <p className="text-sm text-cinematic-text/70">{review.role}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-cinematic-text/30'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-accent/20 rotate-180" />
                <p className="italic text-cinematic-text/90 pl-6">
                  "{review.review}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-6 w-6 text-amber-400 fill-amber-400" 
                />
              ))}
            </div>
            <span className="ml-2 text-2xl font-bold">4.8/5</span>
          </div>
          <p className="text-cinematic-text/70 mt-2">Average rating from over 1,200 community members</p>
        </div>
      </div>
    </section>
  );
};

export default SiteReviews;
