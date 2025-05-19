
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, BookOpen, User, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { usePendingBooks, useUpdateBookStatus } from '@/hooks/useBooks';

const AdminDashboardApprovals: React.FC = () => {
  const { data: pendingBooks, isLoading, error } = usePendingBooks();
  const updateBookStatus = useUpdateBookStatus();
  
  const [feedbackDialog, setFeedbackDialog] = useState<{
    isOpen: boolean;
    bookId: string | null;
    action: 'approve' | 'reject';
    feedback: string;
  }>({
    isOpen: false,
    bookId: null,
    action: 'approve',
    feedback: '',
  });
  
  const openFeedbackDialog = (bookId: string, action: 'approve' | 'reject') => {
    setFeedbackDialog({
      isOpen: true,
      bookId,
      action,
      feedback: '',
    });
  };
  
  const closeFeedbackDialog = () => {
    setFeedbackDialog({
      isOpen: false,
      bookId: null,
      action: 'approve',
      feedback: '',
    });
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackDialog({
      ...feedbackDialog,
      feedback: e.target.value,
    });
  };
  
  const handleStatusUpdate = () => {
    if (!feedbackDialog.bookId) return;
    
    updateBookStatus.mutate({
      bookId: feedbackDialog.bookId,
      status: feedbackDialog.action === 'approve' ? 'approved' : 'rejected',
    }, {
      onSuccess: () => {
        closeFeedbackDialog();
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
      <h1 className="text-3xl font-serif font-bold mb-2">Book Approvals</h1>
      <p className="text-cinematic-text/70 mb-6">Review and approve pending book submissions.</p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading pending books...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Pending Books</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading pending books. Please try again later.
          </p>
        </div>
      ) : pendingBooks && pendingBooks.length > 0 ? (
        <div className="space-y-6">
          {pendingBooks.map((book) => (
            <Card key={book.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 lg:w-1/6 aspect-[2/3] sm:aspect-auto">
                    <img
                      src={book.cover_image || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-serif font-semibold mb-1">{book.title}</h3>
                            <Link 
                              to={`/writer/${book.writer_id}`} 
                              className="text-sm text-accent hover:underline mb-2 inline-flex items-center"
                            >
                              <User className="h-3 w-3 mr-1" />
                              by {book.profiles?.full_name || book.profiles?.username}
                            </Link>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-500">
                            Pending
                          </Badge>
                        </div>
                        
                        <div className="mb-3 flex flex-wrap gap-1">
                          {book.genre.map((genre, index) => (
                            <Badge key={index} variant="outline" className="bg-cinematic-dark/50">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-cinematic-text/70 text-sm mb-6">{book.summary}</p>
                        
                        <div className="flex items-center text-sm text-cinematic-text/60 mb-4">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>Submitted on {new Date(book.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-auto pt-3 border-t border-cinematic-gray/10">
                        <Link to={`/book/${book.id}`} className="mr-2">
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-red-500/80 hover:bg-red-500 mr-2"
                          onClick={() => openFeedbackDialog(book.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => openFeedbackDialog(book.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-cinematic-gray/30 rounded-lg bg-cinematic-darker/20">
          <div className="mb-4">
            <CheckCircle className="h-12 w-12 text-green-500/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No books pending approval</h3>
          <p className="text-cinematic-text/70 max-w-md mx-auto">
            All submitted books have been reviewed. Check back later for new submissions.
          </p>
        </div>
      )}
      
      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open) closeFeedbackDialog();
        }}
      >
        <DialogContent className="bg-cinematic-darker border-cinematic-gray/20">
          <DialogHeader>
            <DialogTitle>
              {feedbackDialog.action === 'approve' ? 'Approve Book' : 'Reject Book'}
            </DialogTitle>
            <DialogDescription>
              {feedbackDialog.action === 'approve' 
                ? 'The book will be published on the platform after approval.'
                : 'The book will be rejected and the writer will be notified.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Feedback for Writer (Optional)
            </label>
            <Textarea 
              placeholder="Enter feedback or notes for the writer..."
              className="bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent resize-none min-h-[120px]"
              value={feedbackDialog.feedback}
              onChange={handleFeedbackChange}
            />
            {feedbackDialog.action === 'reject' && (
              <p className="text-xs text-cinematic-text/60 mt-2">
                Consider providing constructive feedback to help the writer improve their submission.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={closeFeedbackDialog}>Cancel</Button>
            <Button
              variant={feedbackDialog.action === 'approve' ? 'default' : 'destructive'}
              className={feedbackDialog.action === 'approve' ? 'bg-green-500 hover:bg-green-600' : ''}
              onClick={handleStatusUpdate}
              disabled={updateBookStatus.isPending}
            >
              {updateBookStatus.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {feedbackDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminDashboardApprovals;
