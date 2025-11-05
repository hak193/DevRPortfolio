import { 
  type Template, 
  type InsertTemplate,
  type AppProject,
  type InsertAppProject,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  getAppProjects(): Promise<AppProject[]>;
  getAppProject(id: string): Promise<AppProject | undefined>;
  createAppProject(project: InsertAppProject): Promise<AppProject>;
  updateAppProject(id: string, updates: Partial<AppProject>): Promise<AppProject | undefined>;
  
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private templates: Map<string, Template>;
  private appProjects: Map<string, AppProject>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.templates = new Map();
    this.appProjects = new Map();
    this.contactSubmissions = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockTemplates: InsertTemplate[] = [
      {
        title: "E-Commerce Starter Kit",
        description: "Full-featured online store with payment integration, inventory management, and customer dashboard",
        category: "E-Commerce",
        price: 149,
        image: "/api/placeholder/400/300",
        technologies: ["React", "Node.js", "Stripe", "MongoDB"],
        features: ["Payment Integration", "Inventory Management", "Customer Dashboard", "Analytics"]
      },
      {
        title: "SaaS Dashboard Template",
        description: "Professional admin dashboard with analytics, user management, and subscription handling",
        category: "SaaS",
        price: 199,
        image: "/api/placeholder/400/300",
        technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        features: ["User Authentication", "Analytics Dashboard", "Subscription Management", "API Integration"]
      },
      {
        title: "Social Media Platform",
        description: "Complete social networking solution with real-time chat, posts, and notifications",
        category: "Social",
        price: 249,
        image: "/api/placeholder/400/300",
        technologies: ["React", "Node.js", "Socket.io", "Redis"],
        features: ["Real-time Chat", "User Profiles", "Post Management", "Notifications"]
      },
      {
        title: "Project Management Tool",
        description: "Collaborative workspace with task tracking, team management, and reporting",
        category: "Productivity",
        price: 179,
        image: "/api/placeholder/400/300",
        technologies: ["React", "Node.js", "MongoDB", "Redux"],
        features: ["Task Tracking", "Team Collaboration", "File Sharing", "Reports & Analytics"]
      },
      {
        title: "Learning Management System",
        description: "Educational platform with course management, student tracking, and assessment tools",
        category: "Education",
        price: 299,
        image: "/api/placeholder/400/300",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS S3"],
        features: ["Course Management", "Student Progress Tracking", "Assessments", "Video Integration"]
      },
      {
        title: "Restaurant Ordering System",
        description: "Online food ordering with menu management, order tracking, and delivery integration",
        category: "Food & Beverage",
        price: 169,
        image: "/api/placeholder/400/300",
        technologies: ["React", "Node.js", "Stripe", "Google Maps API"],
        features: ["Menu Management", "Order Tracking", "Payment Processing", "Delivery Integration"]
      }
    ];

    mockTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, { ...template, id });
    });
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  async getAppProjects(): Promise<AppProject[]> {
    return Array.from(this.appProjects.values());
  }

  async getAppProject(id: string): Promise<AppProject | undefined> {
    return this.appProjects.get(id);
  }

  async createAppProject(insertProject: InsertAppProject): Promise<AppProject> {
    const id = randomUUID();
    const project: AppProject = { 
      ...insertProject, 
      id,
      aiPlan: null,
      createdAt: new Date()
    };
    this.appProjects.set(id, project);
    return project;
  }

  async updateAppProject(id: string, updates: Partial<AppProject>): Promise<AppProject | undefined> {
    const project = this.appProjects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.appProjects.set(id, updatedProject);
    return updatedProject;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
