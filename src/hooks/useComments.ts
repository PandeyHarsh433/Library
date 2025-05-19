
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Comment = {
  id: string;
  book_id: string;
  user_id: string;
  content: string;
  created_at: string;
  deleted_at: string | null;
  status: 'approved' | 'rejected' | 'pending' | 'flagged';
  profiles?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  books?: {
    title: string;
    id?: string;
    writer_id?: string;
  };
};

export function useBookComments(bookId: string | undefined) {
  return useQuery({
    queryKey: ["comments", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("No book ID provided");
      
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("book_id", bookId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Ensure status exists for each comment
      const commentsWithStatus = (data || []).map(comment => ({
        ...comment,
        status: comment.status || 'pending'
      }));
      
      return commentsWithStatus as Comment[];
    },
    enabled: !!bookId,
  });
}

export function useMyComments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-comments", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          books:book_id (
            id,
            title
          )
        `)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Ensure status exists for each comment
      const commentsWithStatus = (data || []).map(comment => ({
        ...comment,
        status: comment.status || 'pending'
      }));
      
      return commentsWithStatus as Comment[];
    },
    enabled: !!user?.id,
  });
}

export function useWriterComments(writerId: string | undefined) {
  return useQuery({
    queryKey: ["writer-comments", writerId],
    queryFn: async () => {
      if (!writerId) throw new Error("No writer ID provided");
      
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          ),
          books:book_id (
            id,
            title,
            writer_id
          )
        `)
        .eq("books.writer_id", writerId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Ensure status exists for each comment
      const commentsWithStatus = (data || []).map(comment => ({
        ...comment,
        status: comment.status || 'pending'
      }));
      
      return commentsWithStatus as Comment[];
    },
    enabled: !!writerId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookId, content }: { bookId: string; content: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("comments")
        .insert({
          book_id: bookId,
          user_id: user.id,
          content,
          status: 'pending' // Set default status
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.bookId] });
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .update({ content })
        .eq("id", commentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.book_id] });
      toast.success("Comment updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, bookId }: { commentId: string; bookId: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", commentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.bookId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    },
  });
}

// Add a new hook for updating comment status in the database
export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      commentId, 
      status 
    }: { 
      commentId: string; 
      status: 'approved' | 'rejected' | 'flagged' | 'pending'
    }) => {
      const { data, error } = await supabase
        .from("comments")
        .update({ status })
        .eq("id", commentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all potentially affected queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["my-comments"] }); 
      queryClient.invalidateQueries({ queryKey: ["writer-comments"] });
      
      toast.success(`Comment ${data.status} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update comment status: ${error.message}`);
    },
  });
}
