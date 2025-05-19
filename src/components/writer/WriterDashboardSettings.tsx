import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, AtSign, Save, RefreshCw, Upload, Trash2, Image, Settings as SettingsIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const WriterDashboardSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();

  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    bio: '',
    email: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    showEmail: false,
    publicProfile: true,
  });

  useEffect(() => {
    if (profile && user) {
      setProfileData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        email: user.email || '',
      });
    }
  }, [profile, user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setUploadingAvatar(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // In a real implementation, upload to Supabase storage
      // const { error: uploadError } = await supabase.storage
      //   .from('avatars')
      //   .upload(filePath, file);

      // if (uploadError) throw uploadError;

      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({ avatar_url: `https://your-bucket-url.com/${filePath}` })
      //   .eq('id', user?.id);

      // if (updateError) throw updateError;

      // Simulate successful upload
      setTimeout(async () => {
        setUploadingAvatar(false);
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been updated successfully.',
        });
        await refetchProfile();
      }, 1500);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setUploadingAvatar(false);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your avatar.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      // In a real implementation, update the profile in Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     full_name: profileData.full_name,
      //     username: profileData.username,
      //     bio: profileData.bio,
      //   })
      //   .eq('id', user.id);

      // if (error) throw error;

      // Simulate API call
      setTimeout(async () => {
        setIsSaving(false);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
        await refetchProfile();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSaving(false);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Writer Settings</h1>
        <p className="text-cinematic-text/70 mb-8">Manage your writer profile and account settings.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-cinematic-darker/60 w-full flex justify-start border border-cinematic-gray/20 rounded-md h-12">
          <TabsTrigger 
            value="profile" 
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your public profile information visible to readers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'Avatar'} />
                    <AvatarFallback className="bg-accent/20 text-accent text-xl">
                      {profileData.full_name.split(' ').map(name => name[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-cinematic-darker/60 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-3">
                  <h3 className="text-sm font-medium">Profile Picture</h3>
                  <div className="flex flex-wrap gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-1 px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-md transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </div>
                      <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cinematic-gray/30 text-cinematic-text"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-cinematic-text/60">
                    Recommended: Square JPG or PNG, 500x500 pixels or larger.
                  </p>
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-cinematic-text/50" />
                    <Input 
                      id="fullName" 
                      value={profileData.full_name} 
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} 
                      className="pl-10 bg-cinematic-darker/60 border-cinematic-gray/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-cinematic-text/50" />
                    <Input 
                      id="username" 
                      value={profileData.username} 
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})} 
                      className="pl-10 bg-cinematic-darker/60 border-cinematic-gray/30"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea 
                  id="bio" 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                  className="h-32 bg-cinematic-darker/60 border-cinematic-gray/30"
                  placeholder="Tell readers about yourself and your writing..."
                />
                <p className="text-xs text-cinematic-text/60">
                  This biography will appear on your public profile page. You can use basic formatting.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-cinematic-gray/30 text-cinematic-text"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-accent text-cinematic-darker hover:bg-accent/90"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cinematic-darker mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account information and login details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-cinematic-text/50" />
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                      className="pl-10 bg-cinematic-darker/60 border-cinematic-gray/30"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-cinematic-text/60">
                    To change your email, please contact support.
                  </p>
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="border-cinematic-gray/30 text-cinematic-text"
                  >
                    Change Password
                  </Button>
                  <p className="text-sm text-cinematic-text/70">
                    Your password was last changed 3 months ago.
                  </p>
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
                <div className="p-4 border border-red-500/30 rounded-md bg-red-500/10">
                  <h4 className="font-medium mb-2">Delete Account</h4>
                  <p className="text-sm text-cinematic-text/70 mb-4">
                    Permanently delete your account and all of your content. This action cannot be undone.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Preferences
              </CardTitle>
              <CardDescription>
                Configure your notification and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-cinematic-text/70">Receive email updates about your books and account</p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications} 
                    onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})} 
                  />
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-cinematic-text/70">Make your writer profile visible to all users</p>
                  </div>
                  <Switch 
                    checked={preferences.publicProfile} 
                    onCheckedChange={(checked) => setPreferences({...preferences, publicProfile: checked})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Email</h4>
                    <p className="text-sm text-cinematic-text/70">Display your email address on your public profile</p>
                  </div>
                  <Switch 
                    checked={preferences.showEmail} 
                    onCheckedChange={(checked) => setPreferences({...preferences, showEmail: checked})} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => {
                  toast({
                    title: 'Preferences saved',
                    description: 'Your preferences have been updated successfully.',
                  });
                }}
                className="bg-accent text-cinematic-darker hover:bg-accent/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default WriterDashboardSettings;
