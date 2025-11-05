import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
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
        <div>
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
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
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="input-contact-email"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2">Phone (Optional)</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(508) 555-0123"
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="input-contact-phone"
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
            className="bg-muted border-border rounded-lg focus:ring-2 focus:ring-primary"
            data-testid="textarea-contact-message"
          />
        </div>

        <Button type="submit" className="w-full lg:w-auto" data-testid="button-contact-submit">
          Send Message
        </Button>
      </form>
    </div>
  );
}
