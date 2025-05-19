
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Comment, useUpdateCommentStatus } from '@/hooks/useComments';

const AdminDashboardComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const updateCommentStatus = useUpdateCommentStatus();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id (username, full_name, avatar_url),
            books:book_id (title)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Ensure status field exists for all comments
        const commentsWithStatus = data.map(comment => ({
          ...comment,
          status: comment.status || 'pending' // Default to 'pending' if status doesn't exist
        })) as Comment[];

        setComments(commentsWithStatus);
        setFilteredComments(commentsWithStatus);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error fetching comments',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [toast]);

  // Filter comments based on search query and active tab
  useEffect(() => {
    const filtered = comments.filter(comment => {
      const matchesSearch =
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.books?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'all') return matchesSearch;
      return matchesSearch && comment.status === activeTab;
    });

    setFilteredComments(filtered);
  }, [searchQuery, activeTab, comments]);

  // Update comment status using the hook
  const handleUpdateCommentStatus = async (id: string, status: 'approved' | 'rejected' | 'flagged') => {
    console.log('Updating comment status:', id, status);
    updateCommentStatus.mutate(
      { commentId: id, status },
      {
        onSuccess: (updatedComment) => {
          console.log('Comment updated successfully:', updatedComment);
          // Update local state to reflect the change immediately
          const updatedComments = comments.map(comment =>
            comment.id === id ? { ...comment, status } : comment
          );
          setComments(updatedComments);

          // Also update filtered comments
          const updatedFilteredComments = filteredComments.map(comment =>
            comment.id === id ? { ...comment, status } : comment
          );
          setFilteredComments(updatedFilteredComments);
        }
      }
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'flagged':
        return <Badge className="bg-amber-500">Flagged</Badge>;
      default:
        return <Badge className="bg-blue-500">Pending</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Comment Moderation</h1>
        <p className="text-cinematic-text/70 mb-6">Review and moderate user comments across the platform.</p>
      </div>

      <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Comments</CardTitle>
              <CardDescription className='pt-2'>Manage user comments and feedback</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cinematic-text/50" />
              <Input
                placeholder="Search comments..."
                className="pl-9 bg-cinematic-darker/60 border-cinematic-gray/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="border-b border-cinematic-gray/20 mb-4">
              <TabsList className="bg-transparent w-full flex h-11 justify-start gap-4 rounded-none">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-2"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-2"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-2"
                >
                  Approved
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-2"
                >
                  Rejected
                </TabsTrigger>
                <TabsTrigger
                  value="flagged"
                  className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none px-2"
                >
                  Flagged
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex items-center justify-center h-52">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-cinematic-text/30 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No comments found</h3>
                  <p className="text-cinematic-text/70">
                    {searchQuery ? "Try adjusting your search" : "There are no comments to moderate at this time"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">
                            {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
                          </TableCell>
                          <TableCell>{comment.books?.title || 'Unknown Book'}</TableCell>
                          <TableCell className="max-w-xs">
                            {truncateText(comment.content, 60)}
                          </TableCell>
                          <TableCell>{formatDate(comment.created_at)}</TableCell>
                          <TableCell>
                            {getStatusBadge(comment.status || 'pending')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px] bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleUpdateCommentStatus(comment.id, 'approved')}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleUpdateCommentStatus(comment.id, 'rejected')}
                                >
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleUpdateCommentStatus(comment.id, 'flagged')}
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                                  Flag
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDashboardComments;
