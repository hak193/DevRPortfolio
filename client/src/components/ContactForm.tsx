import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Ready to start your project? Have questions about our services? 
          We're here to help bring your ideas to life.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">Worcester, Massachusetts</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">contact@idevrcode.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">(508) 555-0123</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitted && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-500">Message sent successfully!</p>
          </div>
        )}
        
        <div>
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="input-contact-name"
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            required
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="input-contact-email"
          />
        </div>

        <div>
          <Label htmlFor="subject" className="mb-2">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="What's this about?"
            required
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="input-contact-subject"
          />
        </div>

        <div>
          <Label htmlFor="message" className="mb-2">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your project..."
            rows={6}
            required
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="textarea-contact-message"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full lg:w-auto" 
          disabled={contactMutation.isPending}
          data-testid="button-contact-submit"
        >
          {contactMutation.isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
