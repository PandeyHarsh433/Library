
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, 
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUpdateBook } from '@/hooks/useBooks';

interface Book {
  id: string;
  title: string;
  summary: string;
  genre: string[];
  cover_image: string | null;
  status: 'pending' | 'approved' | 'rejected';
  writer_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

interface AdminBookEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

const GENRE_OPTIONS = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 
  'Horror', 'Historical Fiction', 'Literary Fiction', 'Young Adult', 
  'Children\'s', 'Biography', 'Self-Help', 'Poetry', 'Drama', 'Comedy'
];

const AdminBookEditModal: React.FC<AdminBookEditModalProps> = ({ 
  isOpen, 
  onClose, 
  book 
}) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    summary: '',
    genre: [],
    status: 'pending',
    cover_image: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  const { toast } = useToast();
  const updateBook = useUpdateBook();
  
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        summary: book.summary || '',
        genre: book.genre || [],
        status: book.status || 'pending',
        cover_image: book.cover_image || ''
      });
    }
  }, [book]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddGenre = () => {
    if (selectedGenre && !formData.genre?.includes(selectedGenre)) {
      setFormData(prev => ({
        ...prev,
        genre: [...(prev.genre || []), selectedGenre]
      }));
      setSelectedGenre('');
    }
  };
  
  const handleRemoveGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre?.filter(genre => genre !== genreToRemove) || []
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as 'pending' | 'approved' | 'rejected'
    }));
  };
  
  const handleSave = async () => {
    if (!book) return;
    
    setLoading(true);
    
    try {
      // Fix: Adjust the parameters to match the expected structure
      await updateBook.mutateAsync({
        bookId: book.id,
        bookData: {
          title: formData.title,
          summary: formData.summary,
          genre: formData.genre,
          status: formData.status
          // Note: cover_image is string not File, so omitting it for now
        }
      });
      
      toast({
        title: "Book updated",
        description: "The book has been successfully updated",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!book) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2 text-accent" />
            Edit Book Details
          </DialogTitle>
          <DialogDescription>
            Update information for "{book.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Cover and Status */}
          <div className="space-y-4">
            <div className="bg-cinematic-darker/60 p-4 rounded-md border border-cinematic-gray/30">
              <div className="aspect-[2/3] bg-cinematic-dark/50 rounded-md overflow-hidden mb-4">
                <img 
                  src={formData.cover_image || '/placeholder.svg'} 
                  alt={formData.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cover.jpg"
                  className="bg-cinematic-darker/60 border-cinematic-gray/30"
                />
              </div>
            </div>
            
            <div className="bg-cinematic-darker/60 p-4 rounded-md border border-cinematic-gray/30">
              <Label className="mb-2 block">Book Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="bg-cinematic-darker/60 border-cinematic-gray/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-cinematic-darker/95 border-cinematic-gray/30">
                  <SelectItem value="pending" className="flex items-center">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      Pending Review
                    </div>
                  </SelectItem>
                  <SelectItem value="approved">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Approved
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-2" />
                      Rejected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Separator className="my-4 bg-cinematic-gray/20" />
              
              <div className="text-sm text-cinematic-text/70">
                <p>Created: {new Date(book.created_at).toLocaleDateString()}</p>
                <p>By: {book.profiles?.full_name || book.profiles?.username || 'Unknown Author'}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Main Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className="bg-cinematic-darker/60 border-cinematic-gray/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Enter book summary"
                className="min-h-[120px] bg-cinematic-darker/60 border-cinematic-gray/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.genre?.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className="bg-accent/10 text-accent border-accent/20 flex items-center"
                  >
                    {genre}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleRemoveGenre(genre)}
                    />
                  </Badge>
                ))}
                {formData.genre?.length === 0 && (
                  <span className="text-sm text-cinematic-text/50">No genres selected</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="bg-cinematic-darker/60 border-cinematic-gray/30">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-cinematic-darker/95 border-cinematic-gray/30">
                    {GENRE_OPTIONS.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={handleAddGenre} 
                  variant="outline" 
                  className="border-cinematic-gray/30"
                  disabled={!selectedGenre}
                >
                  Add Genre
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6 flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-cinematic-text"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-accent text-cinematic-darker hover:bg-accent/90"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cinematic-darker mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookEditModal;
