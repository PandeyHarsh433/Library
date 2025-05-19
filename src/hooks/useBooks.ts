
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Book = {
  id: string;
  title: string;
  cover_image: string | null;
  summary: string;
  genre: string[];
  writer_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type BookWithWriter = Book & {
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string | null;
    id: string;
    bio?: string;
  };
};

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          profiles:writer_id (
            id,
            username,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq("status", "approved")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []) as BookWithWriter[];
    },
  });
}

export function useBook(bookId: string | undefined) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) throw new Error("No book ID provided");
      
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          profiles:writer_id (
            id,
            username,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq("id", bookId)
        .single();
      
      if (error) throw error;
      return data as BookWithWriter;
    },
    enabled: !!bookId,
  });
}

export function useBooksByGenre(genre: string) {
  return useQuery({
    queryKey: ["books", "genre", genre],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          profiles:writer_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .contains("genre", [genre])
        .eq("status", "approved")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []) as BookWithWriter[];
    },
    enabled: !!genre,
  });
}

export function useWriterBooks(writerId: string | undefined) {
  return useQuery({
    queryKey: ["books", "writer", writerId],
    queryFn: async () => {
      if (!writerId) throw new Error("No writer ID provided");
      
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          profiles:writer_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("writer_id", writerId)
        .eq("status", "approved")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []) as BookWithWriter[];
    },
    enabled: !!writerId,
  });
}

export function useMyBooks() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-books", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("books")
        .select(`*`)
        .eq("writer_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function usePendingBooks() {
  return useQuery({
    queryKey: ["pending-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          profiles:writer_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("status", "pending")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []) as BookWithWriter[];
    },
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (bookData: {
      title: string;
      summary: string;
      genre: string[];
      cover_image?: File;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      let coverImageUrl = null;
      
      // Upload cover image if provided
      if (bookData.cover_image) {
        const fileExt = bookData.cover_image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('book_covers')
          .upload(filePath, bookData.cover_image);
        
        if (uploadError) throw uploadError;
        
        const { data: imageData } = supabase.storage
          .from('book_covers')
          .getPublicUrl(filePath);
          
        coverImageUrl = imageData.publicUrl;
      }
      
      // Insert book record
      const { data, error } = await supabase
        .from("books")
        .insert({
          title: bookData.title,
          summary: bookData.summary,
          genre: bookData.genre,
          cover_image: coverImageUrl,
          writer_id: user.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      toast.success("Book submitted for approval");
    },
    onError: (error) => {
      toast.error(`Failed to add book: ${error.message}`);
    },
  });
}

export function useUpdateBookStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookId, status }: { bookId: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from("books")
        .update({ status })
        .eq("id", bookId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["pending-books"] });
      toast.success("Book status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update book status: ${error.message}`);
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      bookId, 
      bookData 
    }: { 
      bookId: string; 
      bookData: Partial<{
        title: string;
        summary: string;
        genre: string[];
        cover_image: File;
        status: 'pending' | 'approved' | 'rejected';
      }> 
    }) => {
      let updateData: any = { ...bookData };
      delete updateData.cover_image;
      
      if (bookData.cover_image) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Not authenticated");
        
        const fileExt = bookData.cover_image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userData.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('book_covers')
          .upload(filePath, bookData.cover_image);
        
        if (uploadError) throw uploadError;
        
        const { data: imageData } = supabase.storage
          .from('book_covers')
          .getPublicUrl(filePath);
          
        updateData.cover_image = imageData.publicUrl;
      }
      
      const { data, error } = await supabase
        .from("books")
        .update(updateData)
        .eq("id", bookId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      toast.success("Book updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update book: ${error.message}`);
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookId: string) => {
      const { data, error } = await supabase
        .from("books")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", bookId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      toast.success("Book deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete book: ${error.message}`);
    },
  });
}
