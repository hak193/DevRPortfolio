import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatPanel from '@/components/ChatPanel';
import ScreenShare from '@/components/ScreenShare';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function Collaboration() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground" data-testid="text-page-title">
              Collaboration Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-page-description">
            Connect with team members in real-time using chat and screen sharing capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="grid-collaboration">
          <Card data-testid="card-chat">
            <CardHeader>
              <CardTitle>Real-time Chat</CardTitle>
              <CardDescription>
                Send and receive messages instantly with other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatPanel />
            </CardContent>
          </Card>

          <Card data-testid="card-screen-share">
            <CardHeader>
              <CardTitle>Screen Sharing</CardTitle>
              <CardDescription>
                Share your screen, window, or tab with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScreenShare />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg" data-testid="info-section">
          <h2 className="text-xl font-bold mb-3">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Chat Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time messaging with WebSocket connection</li>
                <li>See who sent each message and when</li>
                <li>Messages broadcast to all connected users</li>
                <li>Connection status indicator</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Screen Share Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Share your entire screen or specific window</li>
                <li>Browser tab sharing support</li>
                <li>Easy start/stop controls</li>
                <li>Local preview of shared content</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
