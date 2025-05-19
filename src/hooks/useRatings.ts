
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Rating = {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  deleted_at: string | null;
};

export function useBookRatings(bookId: string | undefined) {
  return useQuery({
    queryKey: ["ratings", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("No book ID provided");
      
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("book_id", bookId)
        .is("deleted_at", null);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!bookId,
  });
}

export function useBookAverageRating(bookId: string | undefined) {
  const { data: ratings } = useBookRatings(bookId);
  
  if (!ratings || ratings.length === 0) {
    return { averageRating: 0, ratingCount: 0 };
  }
  
  const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    ratingCount: ratings.length
  };
}

export function useMyRating(bookId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-rating", bookId, user?.id],
    queryFn: async () => {
      if (!bookId || !user?.id) throw new Error("No book ID or user ID provided");
      
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!bookId && !!user?.id,
  });
}

export function useAddRating() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookId, rating }: { bookId: string; rating: number }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      // Check if user already rated this book
      const { data: existingRating } = await supabase
        .from("ratings")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle();
      
      if (existingRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from("ratings")
          .update({ rating })
          .eq("id", existingRating.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from("ratings")
          .insert({
            book_id: bookId,
            user_id: user.id,
            rating
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ratings", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", variables.bookId] });
      toast.success("Rating saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save rating: ${error.message}`);
    },
  });
}

export function useDeleteRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ratingId, bookId }: { ratingId: string; bookId: string }) => {
      const { data, error } = await supabase
        .from("ratings")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", ratingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ratings", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", variables.bookId] });
      toast.success("Rating removed successfully");
    },
    onError: (error) => {
      toast.error(`Failed to remove rating: ${error.message}`);
    },
  });
}
