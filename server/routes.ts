import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTemplateSchema, 
  insertAppProjectSchema,
  insertContactSubmissionSchema 
} from "@shared/schema";
import { 
  getAppTypeSuggestions, 
  getFeatureSuggestions, 
  getTargetAudienceSuggestions,
  generateAppPlan 
} from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.post("/api/app-projects", async (req, res) => {
    try {
      const validatedData = insertAppProjectSchema.parse(req.body);
      const project = await storage.createAppProject(validatedData);
      
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
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
