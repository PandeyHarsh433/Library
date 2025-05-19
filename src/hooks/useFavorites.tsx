import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookWithWriter } from "./useBooks";

export type Favorite = {
    id: string;
    user_id: string;
    book_id: string;
    created_at: string;
};

// Check if a book is favorited by the current user
export function useIsFavorited(bookId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["favorite", bookId, user?.id],
        queryFn: async () => {
            if (!bookId || !user?.id) return false;

            const { data, error } = await supabase
                .from("favorites")
                .select("*")
                .eq("user_id", user.id)
                .eq("book_id", bookId)
                .maybeSingle();

            if (error) throw error;
            return !!data;
        },
        enabled: !!bookId && !!user?.id,
    });
}

// Get all favorites for the current user
export function useMyFavorites() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["favorites", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            const { data, error } = await supabase
                .from("favorites")
                .select(`
          *,
          books:book_id (
            *,
            profiles:writer_id (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `)
                .eq("user_id", user.id);

            if (error) throw error;
            return data.map(fav => ({
                id: fav.id,
                createdAt: fav.created_at,
                book: fav.books as BookWithWriter
            }));
        },
        enabled: !!user?.id,
    });
}

// Add or remove a book from favorites
export function useToggleFavorite() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ bookId, isFavorited }: { bookId: string; isFavorited: boolean }) => {
            if (!user?.id) throw new Error("Not authenticated");

            if (isFavorited) {
                // Remove from favorites
                const { error } = await supabase
                    .from("favorites")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("book_id", bookId);

                if (error) throw error;
                return { isFavorited: false };
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from("favorites")
                    .insert({
                        user_id: user.id,
                        book_id: bookId
                    });

                if (error) throw error;
                return { isFavorited: true };
            }
        },
        onSuccess: (result, variables) => {
            queryClient.invalidateQueries({ queryKey: ["favorite", variables.bookId] });
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
            toast.success(result.isFavorited ? "Added to favorites" : "Removed from favorites");
        },
        onError: (error) => {
            toast.error(`Failed to update favorites: ${error.message}`);
        }
    });
}