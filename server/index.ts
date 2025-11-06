import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./auth";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Configure session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  conString: process.env.DATABASE_URL!,
  tableName: "session",
  createTableIfMissing: true,
});

// Session configuration
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsers
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // WebSocket server setup with session authentication
  const wss = new WebSocketServer({ noServer: true });
  const clients = new Map<string, { ws: WebSocket; username: string; userId: string }>();

  // Handle WebSocket upgrade with session authentication
  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '/', `http://${request.headers.host}`).pathname;
    
    // Only handle collaboration WebSocket
    if (pathname !== '/ws/collaborate') {
      socket.destroy();
      return;
    }

    // Parse session ID from cookie
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Extract session ID from cookie
    const cookieMatch = cookieHeader.match(/connect\.sid=s%3A([^.]+)/);
    if (!cookieMatch) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    const sessionId = cookieMatch[1];
    
    // Get session from store
    sessionStore.get(sessionId, (err: any, sessionData: any) => {
      if (err || !sessionData || !sessionData.passport || !sessionData.passport.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // Attach user info to request
      (request as any).userId = sessionData.passport.user;
      
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
  });

  wss.on('connection', async (ws, req) => {
    const userId = (req as any).userId;
    
    if (!userId) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    // Get user info from storage
    const { storage } = await import('./storage');
    const user = await storage.getUserById(userId);
    
    if (!user) {
      ws.close(1008, 'User not found');
      return;
    }

    clients.set(userId, { ws, username: user.username, userId });
    log(`WebSocket client connected: ${user.username} (${userId})`);

    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to chat server',
      username: user.username,
    }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Add sender info for security
        const messageWithSender = {
          ...data,
          userId,
          username: user.username,
        };
        
        // Broadcast to all connected clients
        clients.forEach((client) => {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(messageWithSender));
          }
        });
      } catch (error) {
        log(`WebSocket message error: ${error}`);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
      log(`WebSocket client disconnected: ${user.username} (${userId})`);
    });

    ws.on('error', (error) => {
      log(`WebSocket error: ${error}`);
    });

    // Mark as alive for heartbeat
    (ws as any).isAlive = true;
    ws.on('pong', () => {
      (ws as any).isAlive = true;
    });
  });

  // Ping clients every 30 seconds to keep connections alive
  const heartbeatInterval = setInterval(() => {
    clients.forEach((client, userId) => {
      if ((client.ws as any).isAlive === false) {
        clients.delete(userId);
        return client.ws.terminate();
      }

      (client.ws as any).isAlive = false;
      client.ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Server may already be running.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
})();