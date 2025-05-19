
import React, { useState } from 'react';
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
import {
  Link as LinkIcon,
  Copy,
  Facebook,
  Twitter,
  Mail,
  Check,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  type?: 'book' | 'writer' | 'page';
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  type = 'book'
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`Check out this ${type} on Lumina: ${title}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };

  const handleSocialShare = (platform: keyof typeof socialLinks) => {
    window.open(socialLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2 text-accent" />
            Share {type === 'book' ? 'this book' : type === 'writer' ? 'this writer' : 'this page'}
          </DialogTitle>
          <DialogDescription className='pt-2'>
            Share "{title}" with friends and fellow readers
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-2">
          <div className="grid flex-1 gap-2">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
              <Input
                className="pl-10 border-cinematic-gray/30 bg-cinematic-darker/60 focus:border-accent focus:ring-accent"
                readOnly
                value={url}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-accent text-cinematic-darker hover:bg-accent/90 px-3"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="my-4">
          <h4 className="text-sm text-cinematic-text/70 mb-3">Share on social media</h4>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-cinematic-gray/30 hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500"
              onClick={() => handleSocialShare('facebook')}
            >
              <Facebook className="h-5 w-5 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-cinematic-gray/30 hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400"
              onClick={() => handleSocialShare('twitter')}
            >
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-cinematic-gray/30 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500"
              onClick={() => handleSocialShare('email')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-center mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-cinematic-text hover:text-accent hover:bg-accent/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
