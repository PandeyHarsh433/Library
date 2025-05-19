
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Loader2, AlertTriangle, User, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

const AdminDashboardUsers: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (err: any) {
        setError(err.message);
        toast.error(`Failed to load users: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(`Failed to update role: ${err.message}`);
    } finally {
      setUpdatingUserId(null);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-serif font-bold mb-2">User Management</h1>
      <p className="text-cinematic-text/70 mb-6">Manage users, writers, and access permissions.</p>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-cinematic-text/50 hover:text-cinematic-text"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="w-full sm:w-auto min-w-[150px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="writer">Writers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-xl font-medium mb-2">Error Loading Users</h3>
          <p className="text-cinematic-text/70 text-center">
            There was a problem loading the users. Please try again later.
          </p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-cinematic-darker/30 border-cinematic-gray/20">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-1/4 flex flex-row sm:flex-col gap-4 items-center sm:items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {(user.username?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{user.full_name || 'No name'}</p>
                      <p className="text-cinematic-text/70">@{user.username}</p>
                      <Badge 
                        className={`mt-2 ${
                          user.role === 'admin' 
                            ? 'bg-red-500/20 text-red-500' 
                            : user.role === 'writer' 
                              ? 'bg-accent/20 text-accent'
                              : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {user.role === 'writer' && <UserCheck className="h-3 w-3 mr-1" />}
                        {user.role === 'user' && <User className="h-3 w-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-cinematic-text/70 mb-1">Bio</h4>
                      <p className="text-cinematic-text/90">
                        {user.bio || 'This user has not added a bio yet.'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-sm text-cinematic-text/60">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select 
                          defaultValue={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                          disabled={updatingUserId === user.id}
                        >
                          <SelectTrigger className="bg-cinematic-dark/50 border-cinematic-gray/30 w-[130px]">
                            <SelectValue placeholder="Change role" />
                          </SelectTrigger>
                          <SelectContent className="bg-cinematic-darker border-cinematic-gray/30">
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="writer">Writer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {updatingUserId === user.id && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
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
            <User className="h-12 w-12 text-cinematic-text/30 mx-auto" />
          </div>
          <h3 className="text-xl font-serif font-medium mb-2">No users found</h3>
          <p className="text-cinematic-text/70 max-w-md mx-auto">
            {searchQuery || roleFilter !== 'all'
              ? 'No users match your search criteria. Try adjusting your filters.'
              : 'There are no registered users yet.'}
          </p>
          {(searchQuery || roleFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboardUsers;
