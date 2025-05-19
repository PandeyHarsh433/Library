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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ContactWriterModalProps {
    isOpen: boolean;
    onClose: () => void;
    writerName: string;
    writerEmail?: string;
}

const ContactWriterModal: React.FC<ContactWriterModalProps> = ({
    isOpen,
    onClose,
    writerName,
    writerEmail
}) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleSendMessage = async () => {
        if (!subject.trim() || !message.trim()) {
            toast({
                title: "Missing information",
                description: "Please provide both subject and message",
                variant: "destructive"
            });
            return;
        }

        setIsSending(true);

        try {
            // In a real application, you would send this to a backend service
            // For demonstration, we'll simulate a successful send
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Message sent",
                description: `Your message has been sent to ${writerName}`,
            });

            // Reset form and close modal
            setSubject('');
            setMessage('');
            onClose();
        } catch (error) {
            toast({
                title: "Failed to send message",
                description: "An error occurred while sending your message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-cinematic-darker/95 backdrop-blur-lg border-cinematic-gray/30">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-accent" />
                        Contact {writerName}
                    </DialogTitle>
                    <DialogDescription>
                        Send a message to the writer. They'll receive your message via email.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="from">From</Label>
                        <Input
                            id="from"
                            value={user?.email || ''}
                            disabled
                            className="bg-cinematic-darker/60 border-cinematic-gray/30 focus:border-accent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter a subject..."
                            className="bg-cinematic-darker/60 border-cinematic-gray/30 focus:border-accent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            rows={5}
                            className="bg-cinematic-darker/60 border-cinematic-gray/30 focus:border-accent"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-cinematic-text hover:text-accent hover:bg-accent/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSendMessage}
                        disabled={isSending || !subject.trim() || !message.trim()}
                        className="bg-accent text-cinematic-darker hover:bg-accent/90"
                    >
                        {isSending ? (
                            <>Sending...</>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ContactWriterModal;