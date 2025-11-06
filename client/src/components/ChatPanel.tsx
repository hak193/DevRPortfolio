import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket connection setup
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/collaborate`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'welcome') {
          console.log(data.message);
        } else if (data.type === 'chat') {
          // Server adds userId and username for security, trust those values
          const newMessage: ChatMessage = {
            id: data.id,
            userId: data.userId,
            username: data.username,
            message: data.message,
            timestamp: new Date(data.timestamp),
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [user]);

  const handleSendMessage = () => {
    if (!ws || !user || !inputMessage.trim() || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
      message: inputMessage.trim(),
      timestamp: new Date(),
    };

    ws.send(JSON.stringify({
      type: 'chat',
      ...message,
    }));

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground" data-testid="chat-not-authenticated">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Please log in to use chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]" data-testid="chat-panel">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Real-time Chat</span>
        </div>
        <Badge 
          variant={isConnected ? "default" : "secondary"}
          data-testid="badge-connection-status"
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <ScrollArea className="flex-1 rounded-md border p-4 mb-4" data-testid="scroll-messages">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12" data-testid="text-no-messages">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.userId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                  data-testid={`message-${msg.id}`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span 
                      className={`text-sm font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}
                      data-testid={`text-username-${msg.id}`}
                    >
                      {msg.username}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`text-timestamp-${msg.id}`}>
                      {format(msg.timestamp, 'HH:mm')}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    data-testid={`text-message-${msg.id}`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
          data-testid="input-message"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          size="icon"
          data-testid="button-send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
