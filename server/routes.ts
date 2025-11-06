import express, { type Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertTemplateSchema, 
  insertAppProjectSchema,
  insertContactSubmissionSchema,
  insertUserSchema
} from "@shared/schema";
import { 
  getAppTypeSuggestions, 
  getFeatureSuggestions, 
  getTargetAudienceSuggestions,
  generateAppPlan 
} from "./gemini";
import passport, { ensureAuthenticated, ensureEmailVerified, ensureAdmin, generateOTP, getOTPExpiry } from "./auth";
import { sendContactNotification, sendOTPEmail, sendPurchaseConfirmation } from "./email";
import type { SafeUser } from "@shared/schema";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed templates on startup
  await storage.seedTemplatesIfEmpty();

  // ========== Authentication Routes ==========
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Create user
      const user = await storage.createUser(validatedData);
      
      // Generate and save OTP
      const otp = generateOTP();
      await storage.updateUserOtp(user.id, otp, getOTPExpiry());
      
      // Send OTP email
      await sendOTPEmail(user.email, otp);
      
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ error: "Registration successful but login failed" });
        }
        res.status(201).json({ user, message: "Registration successful. Check console for OTP (in production, check email)." });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0]?.message || "Invalid data" });
      }
      res.status(400).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: SafeUser | false, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session login error:", loginErr);
          return res.status(500).json({ error: "Login failed" });
        }
        res.json({ user, message: "Login successful" });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", ensureAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/send-otp", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as SafeUser;
      
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      // Generate new OTP
      const otp = generateOTP();
      await storage.updateUserOtp(user.id, otp, getOTPExpiry());
      
      // Send OTP email
      await sendOTPEmail(user.email, otp);
      
      res.json({ message: "OTP sent. Please check your email." });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", ensureAuthenticated, async (req, res) => {
    try {
      const { otp } = req.body;
      const user = req.user as SafeUser;
      
      if (!otp) {
        return res.status(400).json({ error: "OTP required" });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      
      // Get full user with OTP data
      const fullUser = await storage.getUserByEmail(user.email);
      if (!fullUser || !fullUser.otpSecret) {
        return res.status(400).json({ error: "No OTP found. Please request a new one." });
      }
      
      // Check expiry
      if (fullUser.otpExpiry && new Date() > fullUser.otpExpiry) {
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
      }
      
      // Verify OTP
      if (fullUser.otpSecret !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      
      // Mark email as verified
      await storage.verifyUserEmail(user.id);
      
      // Update session user
      const updatedUser = await storage.getUserById(user.id);
      req.login(updatedUser!, (err) => {
        if (err) console.error("Session update error:", err);
      });
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // ========== Template Routes ==========
  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", ensureAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  // ========== Payment Routes ==========
  app.post("/api/payments/create-intent", ensureAuthenticated, ensureEmailVerified, async (req, res) => {
    try {
      const { templateId } = req.body;
      const user = req.user as SafeUser;
      
      if (!templateId) {
        return res.status(400).json({ error: "Template ID required" });
      }
      
      // Check if already purchased
      const hasPurchased = await storage.hasUserPurchasedTemplate(user.id, templateId);
      if (hasPurchased) {
        return res.status(400).json({ error: "Template already purchased" });
      }
      
      // Get template details
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: template.price * 100, // Convert to cents
        currency: "usd",
        metadata: {
          userId: user.id,
          templateId: template.id,
        },
      });
      
      // Store payment record
      await storage.createPayment({
        userId: user.id,
        templateId: template.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: template.price,
        status: "pending",
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ error: error.message || "Failed to create payment intent" });
    }
  });

  // Webhook endpoint for Stripe payment confirmation
  app.post("/api/payments/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !endpointSecret) {
      // In development without webhook secret, handle manual confirmation
      if (process.env.NODE_ENV === "development") {
        try {
          const { paymentIntentId } = JSON.parse(req.body.toString());
          
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status === "succeeded") {
            const payment = await storage.getPaymentByIntentId(paymentIntentId);
            
            if (payment && payment.status !== "succeeded") {
              await storage.updatePaymentStatus(payment.id, "succeeded");
              await storage.createUserPurchase({
                userId: payment.userId,
                templateId: payment.templateId,
                paymentId: payment.id,
              });
              
              // Send purchase confirmation email
              const user = await storage.getUserById(payment.userId);
              const template = await storage.getTemplate(payment.templateId);
              if (user && template) {
                await sendPurchaseConfirmation({
                  email: user.email,
                  username: user.username,
                  templateTitle: template.title,
                  amount: payment.amount,
                });
              }
            }
          }
          
          return res.json({ received: true });
        } catch (error) {
          console.error("Manual webhook processing error:", error);
          return res.status(400).json({ error: "Invalid request" });
        }
      }
      return res.status(400).json({ error: "Missing stripe signature" });
    }
    
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as any;
        
        // Update payment status
        const payment = await storage.getPaymentByIntentId(paymentIntent.id);
        if (payment) {
          await storage.updatePaymentStatus(payment.id, "succeeded");
          
          // Create user purchase
          await storage.createUserPurchase({
            userId: payment.userId,
            templateId: payment.templateId,
            paymentId: payment.id,
          });
          
          // Send purchase confirmation email
          const user = await storage.getUserById(payment.userId);
          const template = await storage.getTemplate(payment.templateId);
          if (user && template) {
            await sendPurchaseConfirmation({
              email: user.email,
              username: user.username,
              templateTitle: template.title,
              amount: payment.amount,
            });
          }
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook processing failed" });
    }
  });

  // ========== Download Routes ==========
  app.get("/api/downloads/:templateId", ensureAuthenticated, async (req, res) => {
    try {
      const { templateId } = req.params;
      const user = req.user as SafeUser;
      
      // Check if user has purchased
      const hasPurchased = await storage.hasUserPurchasedTemplate(user.id, templateId);
      if (!hasPurchased) {
        return res.status(403).json({ error: "Template not purchased" });
      }
      
      // Get template
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Increment download count
      await storage.incrementDownloadCount(user.id, templateId);
      
      // Return download URL (in production, generate a secure, time-limited URL)
      res.json({ downloadUrl: template.downloadUrl });
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Download failed" });
    }
  });

  // ========== User Account Routes ==========
  app.get("/api/user/purchases", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as SafeUser;
      const purchases = await storage.getUserPurchases(user.id);
      
      // Get template details for each purchase
      const purchasesWithTemplates = await Promise.all(
        purchases.map(async (purchase) => {
          const template = await storage.getTemplate(purchase.templateId);
          return { ...purchase, template };
        })
      );
      
      res.json(purchasesWithTemplates);
    } catch (error) {
      console.error("Fetch purchases error:", error);
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

  // ========== Existing Routes (App Projects, Contact, AI) ==========
  app.post("/api/app-projects", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as SafeUser;
      const validatedData = insertAppProjectSchema.parse(req.body);
      const project = await storage.createAppProject({
        ...validatedData,
        userId: user.id,
      });
      
      const aiPlan = await generateAppPlan({
        appName: validatedData.appName,
        appType: validatedData.appType,
        description: validatedData.description,
        features: validatedData.features,
        targetAudience: validatedData.targetAudience
      });
      
      const updatedProject = await storage.updateAppProject(project.id, { aiPlan });
      
      res.status(201).json(updatedProject);
    } catch (error) {
      console.error("Error creating app project:", error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.get("/api/app-projects/:id", async (req, res) => {
    try {
      const project = await storage.getAppProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/ai/suggestions/app-type", async (_req, res) => {
    try {
      const suggestions = await getAppTypeSuggestions();
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting app type suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.post("/api/ai/suggestions/features", async (req, res) => {
    try {
      const { appType, description } = req.body;
      const suggestions = await getFeatureSuggestions(appType || "", description || "");
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting feature suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.post("/api/ai/suggestions/target-audience", async (req, res) => {
    try {
      const { appType, description } = req.body;
      const suggestions = await getTargetAudienceSuggestions(appType || "", description || "");
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting target audience suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      await sendContactNotification({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });
      
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // ========== User Project Routes ==========
  app.get("/api/user/app-projects", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as SafeUser;
      const projects = await storage.getUserAppProjects(user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/user/app-projects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as SafeUser;
      const project = await storage.getUserAppProject(user.id, req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // ========== Admin Routes ==========
  // Get admin dashboard stats
  app.get("/api/admin/stats", ensureAdmin, async (_req, res) => {
    try {
      const [usersCount, totalRevenue, templates, payments] = await Promise.all([
        storage.getUsersCount(),
        storage.getTotalRevenue(),
        storage.getTemplates(),
        storage.getAllPayments()
      ]);

      // Enrich recent payments with user and template data
      const recentPayments = await Promise.all(
        payments.slice(0, 10).map(async (payment) => {
          const [user, template] = await Promise.all([
            storage.getUserById(payment.userId),
            storage.getTemplate(payment.templateId)
          ]);
          return {
            ...payment,
            userEmail: user?.email || 'Unknown',
            templateTitle: template?.title || 'Unknown'
          };
        })
      );

      const stats = {
        usersCount,
        templatesCount: templates.length,
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
        recentPayments,
        successfulPayments: payments.filter(p => p.status === "succeeded").length,
        pendingPayments: payments.filter(p => p.status === "pending").length
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get all users
  app.get("/api/admin/users", ensureAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user admin status
  app.patch("/api/admin/users/:id/admin", ensureAdmin, async (req, res) => {
    try {
      const { isAdmin } = req.body;
      if (typeof isAdmin !== "boolean") {
        return res.status(400).json({ error: "isAdmin must be a boolean" });
      }

      const updatedUser = await storage.updateUserAdminStatus(req.params.id, isAdmin);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Admin: Create template
  app.post("/api/admin/templates", ensureAdmin, async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error: any) {
      console.error("Error creating template:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0]?.message || "Invalid data" });
      }
      res.status(400).json({ error: "Failed to create template" });
    }
  });

  // Admin: Update template
  app.patch("/api/admin/templates/:id", ensureAdmin, async (req, res) => {
    try {
      const updates = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(req.params.id, updates);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error: any) {
      console.error("Error updating template:", error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0]?.message || "Invalid data" });
      }
      res.status(400).json({ error: "Failed to update template" });
    }
  });

  // Admin: Delete template
  app.delete("/api/admin/templates/:id", ensureAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTemplate(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Admin: Get all payments
  app.get("/api/admin/payments", ensureAdmin, async (_req, res) => {
    try {
      const payments = await storage.getAllPayments();
      
      // Enrich payments with user and template data
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          const [user, template] = await Promise.all([
            storage.getUserById(payment.userId),
            storage.getTemplate(payment.templateId)
          ]);
          return {
            ...payment,
            userEmail: user?.email || 'Unknown',
            templateTitle: template?.title || 'Unknown'
          };
        })
      );
      
      res.json(enrichedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}