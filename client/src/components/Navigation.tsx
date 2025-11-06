import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/store', label: 'Template Store' },
    { href: '/app-builder', label: 'App Builder' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
            {user && (
              <>
                <Link 
                  href="/collaborate"
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                    location === '/collaborate'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  data-testid="link-collaborate"
                >
                  Collaborate
                </Link>
                <Link 
                  href="/projects"
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                    location.startsWith('/projects')
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  data-testid="link-projects"
                >
                  Projects
                </Link>
              </>
            )}
            {user?.isAdmin && (
              <Link 
                href="/admin"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                  location.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                data-testid="link-admin-panel"
              >
                Admin Panel
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" data-testid="button-user-menu">
                    <User className="mr-2 h-4 w-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" data-testid="link-admin-dropdown">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" data-testid="link-account">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  {!user.emailVerified && (
                    <DropdownMenuItem asChild>
                      <Link href="/verify-email" data-testid="link-verify">
                        Verify Email
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" size="default" asChild data-testid="button-login">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="default" asChild data-testid="button-get-started">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
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
            {user && (
              <>
                <Link 
                  href="/collaborate"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-md hover-elevate ${
                    location === '/collaborate'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  data-testid="mobile-link-collaborate"
                >
                  Collaborate
                </Link>
                <Link 
                  href="/projects"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-md hover-elevate ${
                    location.startsWith('/projects')
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  data-testid="mobile-link-projects"
                >
                  Projects
                </Link>
              </>
            )}
            {user?.isAdmin && (
              <Link 
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-md hover-elevate ${
                  location.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                data-testid="mobile-link-admin-panel"
              >
                Admin Panel
              </Link>
            )}
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Link href="/account" className="block">
                    <Button variant="outline" className="w-full" data-testid="button-mobile-account">
                      <User className="mr-2 h-4 w-4" />
                      {user.username}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleLogout}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild data-testid="button-mobile-login">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full" asChild data-testid="button-mobile-get-started">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}