import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  users,
  templates,
  payments,
  userPurchases,
  appProjects,
  contactSubmissions,
  type User,
  type InsertUser,
  type SafeUser,
  type Template,
  type InsertTemplate,
  type Payment,
  type InsertPayment,
  type UserPurchase,
  type InsertUserPurchase,
  type AppProject,
  type InsertAppProject,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";

export interface IStorage {
  // User methods
  createUser(data: InsertUser & { password: string }): Promise<SafeUser>;
  getUserById(id: string): Promise<SafeUser | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUserOtp(userId: string, otpSecret: string | null, otpExpiry: Date | null): Promise<void>;
  verifyUserEmail(userId: string): Promise<void>;
  validateUserPassword(email: string, password: string): Promise<SafeUser | null>;

  // Admin user methods
  getAllUsers(): Promise<SafeUser[]>;
  updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<SafeUser | undefined>;
  getUsersCount(): Promise<number>;

  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  seedTemplatesIfEmpty(): Promise<void>;

  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByIntentId(intentId: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string): Promise<Payment | undefined>;
  getUserPayments(userId: string): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  getTotalRevenue(): Promise<number>;

  // User purchase methods
  createUserPurchase(purchase: InsertUserPurchase): Promise<UserPurchase>;
  getUserPurchases(userId: string): Promise<UserPurchase[]>;
  hasUserPurchasedTemplate(userId: string, templateId: string): Promise<boolean>;
  incrementDownloadCount(userId: string, templateId: string): Promise<void>;

  // Existing methods
  getAppProjects(): Promise<AppProject[]>;
  getAppProject(id: string): Promise<AppProject | undefined>;
  createAppProject(project: InsertAppProject): Promise<AppProject>;
  updateAppProject(id: string, updates: Partial<AppProject>): Promise<AppProject | undefined>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class DrizzleStorage implements IStorage {
  private db;

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const sql = neon(connectionString);
    this.db = drizzle(sql);
  }

  // User methods
  async createUser(data: InsertUser & { password: string }): Promise<SafeUser> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const [user] = await this.db
      .insert(users)
      .values({
        email: data.email,
        username: data.username,
        passwordHash,
      })
      .returning();

    const { passwordHash: _, otpSecret: __, ...safeUser } = user;
    return safeUser;
  }

  async getUserById(id: string): Promise<SafeUser | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;
    const { passwordHash, otpSecret, ...safeUser } = user;
    return safeUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUserOtp(userId: string, otpSecret: string | null, otpExpiry: Date | null): Promise<void> {
    await this.db
      .update(users)
      .set({ otpSecret, otpExpiry })
      .where(eq(users.id, userId));
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await this.db
      .update(users)
      .set({ emailVerified: true, otpSecret: null, otpExpiry: null })
      .where(eq(users.id, userId));
  }

  async validateUserPassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    const { passwordHash, otpSecret, ...safeUser } = user;
    return safeUser;
  }

  // Admin user methods
  async getAllUsers(): Promise<SafeUser[]> {
    const allUsers = await this.db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers.map(({ passwordHash, otpSecret, ...safeUser }) => safeUser);
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<SafeUser | undefined> {
    const [updated] = await this.db
      .update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updated) return undefined;
    const { passwordHash, otpSecret, ...safeUser } = updated;
    return safeUser;
  }

  async getUsersCount(): Promise<number> {
    const result = await this.db.select().from(users);
    return result.length;
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return await this.db.select().from(templates).orderBy(desc(templates.createdAt));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await this.db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await this.db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updated] = await this.db
      .update(templates)
      .set(updates)
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await this.db.delete(templates).where(eq(templates.id, id)).returning();
    return result.length > 0;
  }

  async seedTemplatesIfEmpty(): Promise<void> {
    const existingTemplates = await this.getTemplates();
    if (existingTemplates.length > 0) return;

    const seedTemplates: InsertTemplate[] = [
      {
        title: "E-Commerce Platform Starter",
        description: "Full-featured online store with payment integration, inventory management, and customer dashboard. Built with React, Node.js, and Stripe.",
        category: "E-Commerce",
        price: 399,
        image: "@assets/generated_images/E-commerce_app_template_preview_928913a6.png",
        downloadUrl: "https://download.example.com/ecommerce-starter.zip",
        technologies: ["React", "Node.js", "Stripe", "PostgreSQL", "Redis"],
        features: ["Payment Integration", "Inventory Management", "Customer Dashboard", "Analytics", "Email Notifications"],
      },
      {
        title: "SaaS Dashboard Pro",
        description: "Professional admin dashboard with analytics, user management, subscription handling, and multi-tenancy support.",
        category: "SaaS",
        price: 299,
        image: "@assets/generated_images/React_dashboard_template_preview_8047865f.png",
        downloadUrl: "https://download.example.com/saas-dashboard.zip",
        technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker"],
        features: ["User Authentication", "Analytics Dashboard", "Subscription Management", "API Integration", "Multi-tenancy"],
      },
      {
        title: "Mobile App Template",
        description: "Cross-platform mobile application template with authentication, push notifications, and offline support.",
        category: "Mobile",
        price: 249,
        image: "@assets/generated_images/Component_library_template_preview_905a7d29.png",
        downloadUrl: "https://download.example.com/mobile-template.zip",
        technologies: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
        features: ["Cross-platform", "Push Notifications", "Offline Support", "Authentication", "Social Login"],
      },
      {
        title: "API Boilerplate",
        description: "Production-ready REST API with authentication, rate limiting, logging, and comprehensive documentation.",
        category: "Backend",
        price: 149,
        image: "@assets/generated_images/Node_API_template_preview_7f2604df.png",
        downloadUrl: "https://download.example.com/api-boilerplate.zip",
        technologies: ["Node.js", "Express", "MongoDB", "Redis", "Docker"],
        features: ["JWT Authentication", "Rate Limiting", "API Documentation", "Testing Suite", "Docker Support"],
      },
      {
        title: "Admin Panel Template",
        description: "Feature-rich admin panel with user management, content management, and reporting tools.",
        category: "Dashboard",
        price: 199,
        image: "@assets/generated_images/React_dashboard_template_preview_8047865f.png",
        downloadUrl: "https://download.example.com/admin-panel.zip",
        technologies: ["React", "Material-UI", "Node.js", "PostgreSQL", "Chart.js"],
        features: ["User Management", "Content Management", "Reports & Analytics", "Role-based Access", "File Upload"],
      },
      {
        title: "Code Snippets Collection",
        description: "Curated collection of reusable code snippets for common development tasks and patterns.",
        category: "Snippets",
        price: 99,
        image: "@assets/generated_images/Code_snippets_template_preview_642e6c51.png",
        downloadUrl: "https://download.example.com/code-snippets.zip",
        technologies: ["JavaScript", "TypeScript", "Python", "React", "Node.js"],
        features: ["100+ Snippets", "Well Documented", "Best Practices", "Regular Updates", "VS Code Integration"],
      },
    ];

    for (const template of seedTemplates) {
      await this.createTemplate(template);
    }
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await this.db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentByIntentId(intentId: string): Promise<Payment | undefined> {
    const [payment] = await this.db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, intentId));
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment | undefined> {
    const [updated] = await this.db
      .update(payments)
      .set({ status })
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await this.db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getTotalRevenue(): Promise<number> {
    const successfulPayments = await this.db
      .select()
      .from(payments)
      .where(eq(payments.status, "succeeded"));
    return successfulPayments.reduce((total, payment) => total + payment.amount, 0);
  }

  // User purchase methods
  async createUserPurchase(purchase: InsertUserPurchase): Promise<UserPurchase> {
    const [userPurchase] = await this.db.insert(userPurchases).values(purchase).returning();
    return userPurchase;
  }

  async getUserPurchases(userId: string): Promise<UserPurchase[]> {
    return await this.db
      .select()
      .from(userPurchases)
      .where(eq(userPurchases.userId, userId))
      .orderBy(desc(userPurchases.purchasedAt));
  }

  async hasUserPurchasedTemplate(userId: string, templateId: string): Promise<boolean> {
    const [purchase] = await this.db
      .select()
      .from(userPurchases)
      .where(and(eq(userPurchases.userId, userId), eq(userPurchases.templateId, templateId)));
    return !!purchase;
  }

  async incrementDownloadCount(userId: string, templateId: string): Promise<void> {
    const [purchase] = await this.db
      .select()
      .from(userPurchases)
      .where(and(eq(userPurchases.userId, userId), eq(userPurchases.templateId, templateId)));

    if (purchase) {
      await this.db
        .update(userPurchases)
        .set({ downloadCount: purchase.downloadCount + 1 })
        .where(eq(userPurchases.id, purchase.id));
    }
  }

  // Existing methods for app projects and contact submissions
  async getAppProjects(): Promise<AppProject[]> {
    return await this.db.select().from(appProjects).orderBy(desc(appProjects.createdAt));
  }

  async getUserAppProjects(userId: string): Promise<AppProject[]> {
    return await this.db
      .select()
      .from(appProjects)
      .where(eq(appProjects.userId, userId))
      .orderBy(desc(appProjects.createdAt));
  }

  async getAppProject(id: string): Promise<AppProject | undefined> {
    const [project] = await this.db.select().from(appProjects).where(eq(appProjects.id, id));
    return project;
  }

  async getUserAppProject(userId: string, id: string): Promise<AppProject | undefined> {
    const [project] = await this.db
      .select()
      .from(appProjects)
      .where(and(eq(appProjects.id, id), eq(appProjects.userId, userId)));
    return project;
  }

  async createAppProject(insertProject: InsertAppProject & { userId: string }): Promise<AppProject> {
    const [project] = await this.db.insert(appProjects).values(insertProject).returning();
    return project;
  }

  async updateAppProject(id: string, updates: Partial<AppProject>): Promise<AppProject | undefined> {
    const [updated] = await this.db
      .update(appProjects)
      .set(updates)
      .where(eq(appProjects.id, id))
      .returning();
    return updated;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await this.db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }
}

// Export instance
export const storage = new DrizzleStorage();