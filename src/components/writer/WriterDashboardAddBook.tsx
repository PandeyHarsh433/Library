
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAddBook } from '@/hooks/useBooks';

const genreOptions = [
  'romance', 'mystery', 'fantasy', 'science fiction', 'thriller', 
  'horror', 'historical fiction', 'literary fiction', 'dystopian',
  'adventure', 'memoir', 'biography', 'self-help', 'non-fiction',
  'poetry', 'drama', 'comedy', 'satire', 'classic', 'young adult',
  'children', 'crime', 'political', 'philosophical', 'allegory'
];

const WriterDashboardAddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [genre, setGenre] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const addBook = useAddBook();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const addGenre = (newGenre: string) => {
    if (!newGenre.trim()) return;
    if (genre.includes(newGenre.toLowerCase())) return;
    if (genre.length >= 5) {
      setErrors({ ...errors, genre: 'Maximum 5 genres allowed' });
      return;
    }
    setGenre([...genre, newGenre.toLowerCase()]);
    setGenreInput('');
    setErrors({ ...errors, genre: '' });
  };

  const removeGenre = (genreToRemove: string) => {
    setGenre(genre.filter(g => g !== genreToRemove));
    setErrors({ ...errors, genre: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!summary.trim()) {
      newErrors.summary = 'Summary is required';
    } else if (summary.length < 50) {
      newErrors.summary = 'Summary must be at least 50 characters';
    }
    
    if (genre.length === 0) {
      newErrors.genre = 'At least one genre is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    addBook.mutate({
      title,
      summary,
      genre,
      cover_image: coverImage || undefined
    }, {
      onSuccess: () => {
        navigate('/writer-dashboard/my-books');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-serif font-bold mb-2">Add New Book</h1>
      <p className="text-cinematic-text/70 mb-8">Create a new book for review and publication.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Cover Upload */}
          <div>
            <Label htmlFor="cover-image" className="block mb-2">Book Cover</Label>
            <div className="border-2 border-dashed border-cinematic-gray/30 rounded-lg p-4 text-center">
              {coverPreview ? (
                <div className="relative">
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full aspect-[2/3] object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center aspect-[2/3] bg-cinematic-dark/50 rounded-md">
                  <Upload className="h-12 w-12 text-cinematic-text/40 mb-2" />
                  <p className="text-cinematic-text/70 mb-2">Drag & drop or click to upload</p>
                  <p className="text-xs text-cinematic-text/50">Recommended size: 800x1200px</p>
                  <input 
                    id="cover-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverChange} 
                    className="hidden" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="mt-4"
                    onClick={() => document.getElementById('cover-image')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-cinematic-text/50 mt-2">
              Upload a cover image for your book (optional but recommended)
            </p>
          </div>
          
          {/* Right Column - Book Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title" className="block mb-2">Book Title</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-cinematic-dark/50 border-cinematic-gray/30"
                placeholder="Enter book title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <Label htmlFor="genre" className="block mb-2">Genres</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {genre.map((g) => (
                  <Badge 
                    key={g} 
                    className="bg-accent/20 hover:bg-accent/30 text-accent"
                  >
                    {g}
                    <button 
                      type="button" 
                      onClick={() => removeGenre(g)} 
                      className="ml-1 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Select 
                  value={genreInput} 
                  onValueChange={(value) => {
                    setGenreInput(value);
                    addGenre(value);
                  }}
                >
                  <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
                    {genreOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => addGenre(genreInput)}
                  disabled={!genreInput || genre.includes(genreInput.toLowerCase())}
                >
                  Add Genre
                </Button>
              </div>
              {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              <p className="text-xs text-cinematic-text/50 mt-1">
                Select up to 5 genres that best describe your book
              </p>
            </div>
            
            <div>
              <Label htmlFor="summary" className="block mb-2">Book Summary</Label>
              <Textarea 
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="bg-cinematic-dark/50 border-cinematic-gray/30 min-h-[150px]"
                placeholder="Write a compelling summary of your book..."
              />
              {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
              <p className="text-xs text-cinematic-text/50 mt-1">
                Minimum 50 characters. This summary will be displayed on your book's page.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-cinematic-gray/20">
          <Button type="button" variant="outline" onClick={() => navigate('/writer-dashboard/my-books')}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={addBook.isPending}
            className="bg-accent text-cinematic-darker hover:bg-accent/90"
          >
            {addBook.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit for Review
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default WriterDashboardAddBook;
