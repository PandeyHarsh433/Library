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
    BookOpen,
    Copy,
    Check,
    ExternalLink,
    ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReadNowModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle: string;
}

interface ShoppingLink {
    name: string;
    url: string;
    icon: React.ReactNode;
}

const ReadNowModal: React.FC<ReadNowModalProps> = ({
    isOpen,
    onClose,
    bookTitle
}) => {
    const { toast } = useToast();
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    // In a real app, these would come from the database or an API
    const shoppingLinks: ShoppingLink[] = [
        {
            name: "Amazon",
            url: `https://www.amazon.com/s?k=${encodeURIComponent(bookTitle)}`,
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2"><path fill="currentColor" d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.384-2.294-.385-.578-1.124-.823-1.785-.823-1.214 0-2.293.62-2.555 1.913-.053.285-.259.566-.542.58l-3.049-.324c-.258-.056-.547-.266-.469-.66.701-3.684 4.02-4.795 7-4.795 1.528 0 3.526.41 4.732 1.573 1.528 1.449 1.381 3.377 1.381 5.483v4.962c0 1.489.616 2.146 1.196 2.951.204.272.247.6 0 .756-.643.535-1.783 1.527-2.408 2.083l-.93-.076zm3.877.913c-3.234 2.388-7.933 3.657-11.981 3.657-6.32 0-12.013-2.33-16.313-6.212-.336-.309-.036-.731.366-.491 4.6 2.676 10.294 4.282 16.166 4.282 3.965 0 8.326-.822 12.343-2.517.601-.263 1.106.395.532.879-.317.267-.61.511-.894.744l-.219.151z" /></svg>
        },
        {
            name: "Barnes & Noble",
            url: `https://www.barnesandnoble.com/s/${encodeURIComponent(bookTitle)}`,
            icon: <BookOpen className="h-4 w-4 mr-2" />
        },
        {
            name: "Book Depository",
            url: `https://www.bookdepository.com/search?searchTerm=${encodeURIComponent(bookTitle)}`,
            icon: <BookOpen className="h-4 w-4 mr-2" />
        },
        {
            name: "Kobo",
            url: `https://www.kobo.com/search?query=${encodeURIComponent(bookTitle)}`,
            icon: <BookOpen className="h-4 w-4 mr-2" />
        }
    ];

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);

        toast({
            title: "Link copied",
            description: "The link has been copied to your clipboard",
        });

        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-accent" />
                        Read "{bookTitle}"
                    </DialogTitle>
                    <DialogDescription>
                        Purchase this book from your preferred retailer.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        {shoppingLinks.map((link, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-cinematic-gray/30 hover:border-accent justify-start"
                                    onClick={() => window.open(link.url, '_blank')}
                                >
                                    {link.icon}
                                    {link.name}
                                    <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="px-3 border-cinematic-gray/30 hover:border-accent"
                                    onClick={() => handleCopyLink(link.url)}
                                >
                                    {copiedUrl === link.url ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <p className="text-sm text-cinematic-text/70">
                            Can't find what you're looking for? Try searching with the title:
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Input
                                value={bookTitle}
                                readOnly
                                className="bg-cinematic-darker/60 border-cinematic-gray/30 focus:border-accent"
                            />
                            <Button
                                variant="outline"
                                className="px-3 border-cinematic-gray/30 hover:border-accent"
                                onClick={() => handleCopyLink(bookTitle)}
                            >
                                {copiedUrl === bookTitle ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-cinematic-text hover:text-accent hover:bg-accent/10"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${bookTitle} book buy`)}`, '_blank')}
                        className="bg-accent text-cinematic-darker hover:bg-accent/90"
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Search More Stores
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReadNowModal;