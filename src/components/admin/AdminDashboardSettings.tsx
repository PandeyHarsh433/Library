
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, Check, AlertTriangle } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const AdminDashboardSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Platform settings
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'Folio',
    tagline: 'Discover Stories That Illuminate The Soul',
    requireApproval: true,
    maxBooksPerWriter: 20,
    enableComments: true,
    enableRatings: true,
    enableWriterApplications: true,
    maintenanceMode: false,
  });

  // Content moderation settings
  const [moderationSettings, setModerationSettings] = useState({
    autoModeration: true,
    filterProfanity: true,
    requireModerationForNewWriters: true,
    maxFlaggedCommentsBeforeBan: 5,
    notifyAdminsOnFlagged: true,
  });

  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    sendWelcomeEmail: true,
    sendBookApprovalEmail: true,
    sendCommentNotifications: true,
    adminEmailAddress: 'admin@lumina-books.com',
    emailFromName: 'Folio Books',
  });

  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Platform settings have been updated successfully',
        action: <Check className="h-4 w-4" />,
      });
    }, 1000);
  };

  const resetSettings = (settingsType: 'platform' | 'moderation' | 'email') => {
    if (settingsType === 'platform') {
      setPlatformSettings({
        siteName: 'Folio',
        tagline: 'Discover Stories That Illuminate The Soul',
        requireApproval: true,
        maxBooksPerWriter: 20,
        enableComments: true,
        enableRatings: true,
        enableWriterApplications: true,
        maintenanceMode: false,
      });
    } else if (settingsType === 'moderation') {
      setModerationSettings({
        autoModeration: true,
        filterProfanity: true,
        requireModerationForNewWriters: true,
        maxFlaggedCommentsBeforeBan: 5,
        notifyAdminsOnFlagged: true,
      });
    } else if (settingsType === 'email') {
      setEmailSettings({
        sendWelcomeEmail: true,
        sendBookApprovalEmail: true,
        sendCommentNotifications: true,
        adminEmailAddress: 'admin@lumina-books.com',
        emailFromName: 'Folio Books',
      });
    }

    toast({
      title: 'Settings reset',
      description: `${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings have been reset to defaults`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Platform Settings</h1>
        <p className="text-cinematic-text/70 mb-8">Configure global platform settings and policies.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-cinematic-darker/60 w-full flex justify-start border border-cinematic-gray/20 rounded-md h-12">
          <TabsTrigger
            value="general"
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="moderation"
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            Content Moderation
          </TabsTrigger>
          <TabsTrigger
            value="emails"
            className="rounded-sm px-4 data-[state=active]:bg-accent data-[state=active]:text-cinematic-darker"
          >
            Email Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Platform Settings */}
        <TabsContent value="general">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Platform Settings
              </CardTitle>
              <CardDescription>
                Configure the basic settings and features of the Folio platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={platformSettings.siteName}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={platformSettings.tagline}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, tagline: e.target.value })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxBooksPerWriter">Maximum Books Per Writer</Label>
                  <Input
                    id="maxBooksPerWriter"
                    type="number"
                    value={platformSettings.maxBooksPerWriter}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maxBooksPerWriter: parseInt(e.target.value) })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Book Approval</h4>
                    <p className="text-sm text-cinematic-text/70">Require admin approval before books are published</p>
                  </div>
                  <Switch
                    checked={platformSettings.requireApproval}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, requireApproval: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Comments</h4>
                    <p className="text-sm text-cinematic-text/70">Allow users to comment on books</p>
                  </div>
                  <Switch
                    checked={platformSettings.enableComments}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, enableComments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Ratings</h4>
                    <p className="text-sm text-cinematic-text/70">Allow users to rate books</p>
                  </div>
                  <Switch
                    checked={platformSettings.enableRatings}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, enableRatings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Writer Applications</h4>
                    <p className="text-sm text-cinematic-text/70">Allow users to apply to become writers</p>
                  </div>
                  <Switch
                    checked={platformSettings.enableWriterApplications}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, enableWriterApplications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h4 className="font-medium text-red-500">Maintenance Mode</h4>
                    <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                  </div>
                  <Switch
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })}
                  />
                </div>
                {platformSettings.maintenanceMode && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-sm text-red-400">
                      <strong>Warning:</strong> When maintenance mode is enabled, only admins can access the site. All other users will see a maintenance page.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-cinematic-gray/30 text-cinematic-text"
                onClick={() => resetSettings('platform')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSaveSettings}
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
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Content Moderation Settings */}
        <TabsContent value="moderation">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Content Moderation Settings
              </CardTitle>
              <CardDescription>
                Configure how user-generated content is moderated on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFlaggedCommentsBeforeBan">Max Flagged Comments Before Ban</Label>
                  <Input
                    id="maxFlaggedCommentsBeforeBan"
                    type="number"
                    value={moderationSettings.maxFlaggedCommentsBeforeBan}
                    onChange={(e) => setModerationSettings({ ...moderationSettings, maxFlaggedCommentsBeforeBan: parseInt(e.target.value) })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Content Moderation</h4>
                    <p className="text-sm text-cinematic-text/70">Use AI to automatically flag inappropriate content</p>
                  </div>
                  <Switch
                    checked={moderationSettings.autoModeration}
                    onCheckedChange={(checked) => setModerationSettings({ ...moderationSettings, autoModeration: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Filter Profanity</h4>
                    <p className="text-sm text-cinematic-text/70">Automatically filter profanity from user comments</p>
                  </div>
                  <Switch
                    checked={moderationSettings.filterProfanity}
                    onCheckedChange={(checked) => setModerationSettings({ ...moderationSettings, filterProfanity: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require Moderation for New Writers</h4>
                    <p className="text-sm text-cinematic-text/70">All content from new writers requires moderation</p>
                  </div>
                  <Switch
                    checked={moderationSettings.requireModerationForNewWriters}
                    onCheckedChange={(checked) => setModerationSettings({ ...moderationSettings, requireModerationForNewWriters: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notify Admins on Flagged Content</h4>
                    <p className="text-sm text-cinematic-text/70">Send email notifications to admins when content is flagged</p>
                  </div>
                  <Switch
                    checked={moderationSettings.notifyAdminsOnFlagged}
                    onCheckedChange={(checked) => setModerationSettings({ ...moderationSettings, notifyAdminsOnFlagged: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-cinematic-gray/30 text-cinematic-text"
                onClick={() => resetSettings('moderation')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSaveSettings}
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
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Notification Settings */}
        <TabsContent value="emails">
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Email Notification Settings
              </CardTitle>
              <CardDescription>
                Configure email notifications sent to users and administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adminEmailAddress">Admin Email Address</Label>
                  <Input
                    id="adminEmailAddress"
                    type="email"
                    value={emailSettings.adminEmailAddress}
                    onChange={(e) => setEmailSettings({ ...emailSettings, adminEmailAddress: e.target.value })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailFromName">Email From Name</Label>
                  <Input
                    id="emailFromName"
                    value={emailSettings.emailFromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, emailFromName: e.target.value })}
                    className="bg-cinematic-darker/60 border-cinematic-gray/30"
                  />
                </div>
              </div>

              <Separator className="my-4 bg-cinematic-gray/20" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Send Welcome Email</h4>
                    <p className="text-sm text-cinematic-text/70">Send a welcome email to new users when they register</p>
                  </div>
                  <Switch
                    checked={emailSettings.sendWelcomeEmail}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, sendWelcomeEmail: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Send Book Approval Notifications</h4>
                    <p className="text-sm text-cinematic-text/70">Notify writers when their books are approved or rejected</p>
                  </div>
                  <Switch
                    checked={emailSettings.sendBookApprovalEmail}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, sendBookApprovalEmail: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Send Comment Notifications</h4>
                    <p className="text-sm text-cinematic-text/70">Notify writers when readers comment on their books</p>
                  </div>
                  <Switch
                    checked={emailSettings.sendCommentNotifications}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, sendCommentNotifications: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-cinematic-gray/30 text-cinematic-text"
                onClick={() => resetSettings('email')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSaveSettings}
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
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminDashboardSettings;
