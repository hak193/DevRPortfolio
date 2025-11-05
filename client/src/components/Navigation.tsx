import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/store', label: 'Template Store' },
    { href: '/app-builder', label: 'App Builder' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-20">
        <div className="flex items-center justify-between h-full">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-extrabold text-foreground hover-elevate rounded-md px-2 -ml-2" 
            data-testid="link-home"
          >
            <span className="text-primary">I-DevR</span> Code
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                  location === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button size="default" data-testid="button-get-started">
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover-elevate rounded-md"
            aria-label="Toggle menu"
            data-testid="button-menu-toggle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-md hover-elevate ${
                  location === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button size="default" className="w-full" data-testid="button-mobile-get-started">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
