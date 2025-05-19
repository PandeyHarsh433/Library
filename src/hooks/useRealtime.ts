
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useRealtimeBooks() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  useEffect(() => {
    // Enable realtime subscriptions for the books table
    const channel = supabase
      .channel('public:books')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'books' 
      }, (payload) => {
        // Invalidate books queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['books'] });
        
        // Show toast notification
        toast.info('A new book has been added', {
          description: `"${payload.new.title}" was just added to the library.`,
          action: {
            label: 'View',
            onClick: () => window.location.href = `/book/${payload.new.id}`,
          },
        });
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'books' 
      }, (payload) => {
        // Invalidate books queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['book', payload.new.id] });
        queryClient.invalidateQueries({ queryKey: ['my-books'] });
        queryClient.invalidateQueries({ queryKey: ['pending-books'] });
        
        // If the book was just approved and it belongs to the current user
        if (payload.new.status === 'approved' && 
            payload.old.status === 'pending' && 
            payload.new.writer_id === user?.id) {
          toast.success('Book Approved!', {
            description: `Your book "${payload.new.title}" has been approved and published.`,
            action: {
              label: 'View',
              onClick: () => window.location.href = `/book/${payload.new.id}`,
            },
          });
        }
        
        // If the book was just rejected and it belongs to the current user
        if (payload.new.status === 'rejected' && 
            payload.old.status === 'pending' && 
            payload.new.writer_id === user?.id) {
          toast.error('Book Rejected', {
            description: `Your book "${payload.new.title}" was not approved for publication.`,
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);
}

export function useRealtimeComments() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  useEffect(() => {
    // Enable realtime subscriptions for the comments table
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments' 
      }, async (payload) => {
        // Invalidate comments queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        
        // For writers: check if comment is on their book
        if (user) {
          try {
            // Get the book first
            const { data: book } = await supabase
              .from('books')
              .select('title, writer_id')
              .eq('id', payload.new.book_id)
              .single();
            
            // If this is a comment on the user's book
            if (book && book.writer_id === user.id && payload.new.user_id !== user.id) {
              // Get commenter's username
              const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', payload.new.user_id)
                .single();
              
              // Show notification to the writer
              toast.info('New Comment', {
                description: `${profile?.username || 'Someone'} commented on your book "${book.title}".`,
                action: {
                  label: 'View',
                  onClick: () => window.location.href = `/book/${payload.new.book_id}`,
                },
              });
            }
          } catch (error) {
            console.error('Error checking comment:', error);
          }
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);
}

export function useRealtimeNotifications() {
  // Use both types of realtime subscriptions
  useRealtimeBooks();
  useRealtimeComments();
}
