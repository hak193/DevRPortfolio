import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4 text-primary">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <a>
            <Button size="lg" data-testid="button-home">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
