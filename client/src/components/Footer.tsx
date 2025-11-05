import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-primary">I-DevR</span> Code
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Professional software development services in Worcester, MA. 
              Building the future, one line of code at a time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover-elevate rounded-md"
                aria-label="GitHub"
                data-testid="link-social-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover-elevate rounded-md"
                aria-label="Twitter"
                data-testid="link-social-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover-elevate rounded-md"
                aria-label="LinkedIn"
                data-testid="link-social-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services" className="text-muted-foreground hover:text-foreground hover-elevate px-1 -ml-1 rounded" data-testid="link-footer-services">
                  Services
                </a>
              </li>
              <li>
                <a href="/store" className="text-muted-foreground hover:text-foreground hover-elevate px-1 -ml-1 rounded" data-testid="link-footer-store">
                  Template Store
                </a>
              </li>
              <li>
                <a href="/app-builder" className="text-muted-foreground hover:text-foreground hover-elevate px-1 -ml-1 rounded" data-testid="link-footer-app-builder">
                  App Builder
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground hover-elevate px-1 -ml-1 rounded" data-testid="link-footer-about">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground hover-elevate px-1 -ml-1 rounded" data-testid="link-footer-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get updates on new templates and services.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-background border-border"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-newsletter-subscribe">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © 2025 I-DevR Code. All rights reserved.
          </p>
          <p data-testid="text-location">
            Worcester, Massachusetts
          </p>
        </div>
      </div>
    </footer>
  );
}
