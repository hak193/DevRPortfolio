import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIFieldSuggestion {
  field: string;
  suggestion: string;
}

export async function getAppTypeSuggestions(): Promise<string> {
  const prompt = `You are an expert software consultant helping clients choose the right type of application for their needs.

Provide clear, concise suggestions for different types of applications they might consider. Include:
- Web Application
- Mobile App
- E-Commerce Platform
- Social Platform
- SaaS Product
- Enterprise Solution

For each type, briefly explain what it's best for and typical use cases. Keep it professional and easy to understand. Format as a clean, readable list with bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return response.text || "Consider the following app types: Web Application, Mobile App, E-Commerce, SaaS, or Enterprise Solution.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Consider the following app types: Web Application (for business tools and dashboards), Mobile App (for on-the-go access), E-Commerce Platform (for online stores), Social Platform (for community building), or SaaS Product (for subscription-based services).";
  }
}

export async function getFeatureSuggestions(appType: string, description: string): Promise<string> {
  const prompt = `You are an expert product manager helping define features for a new application.

App Type: ${appType || "General Application"}
Description: ${description || "Not specified"}

Suggest 8-10 key features that would be essential for this type of application. Consider:
- Core functionality users will need
- Modern best practices
- User experience essentials
- Technical capabilities that add value

Format as a clean bulleted list with brief explanations for each feature. Be specific and actionable.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return response.text || "Consider essential features like user authentication, data management, search & filtering, notifications, analytics dashboard, and mobile responsiveness.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Essential features to consider:\n• User Authentication & Profiles\n• Real-time Notifications\n• Search & Filtering\n• Data Analytics Dashboard\n• Payment Integration\n• File Upload & Management\n• Mobile Responsiveness\n• API Integration";
  }
}

export async function getTargetAudienceSuggestions(appType: string, description: string): Promise<string> {
  const prompt = `You are a marketing strategist helping define the target audience for a new application.

App Type: ${appType || "General Application"}
Description: ${description || "Not specified"}

Help define a clear target audience profile. Include guidance on:
- Demographics (age, location, profession)
- Technical proficiency level
- Primary use cases
- Device preferences
- Pain points this app solves

Provide a framework for thinking about the audience and include 2-3 example audience profiles. Keep it practical and actionable.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return response.text || "Define your audience by considering demographics, tech savviness, use cases, and device preferences.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Define your target audience:\n\nDemographics: Age range, location, profession\nTech Savviness: Beginner, intermediate, or expert users\nPrimary Use Case: Business, personal, education, or entertainment\nDevice Preference: Desktop, mobile, tablet, or multi-platform\n\nExample: Small business owners aged 30-50 who need efficient project management tools accessible on both desktop and mobile devices.";
  }
}

export async function generateAppPlan(projectData: {
  appName: string;
  appType: string;
  description: string;
  features: string;
  targetAudience: string;
}): Promise<string> {
  const prompt = `You are a senior software architect creating a comprehensive development plan for a new application.

Project Details:
- App Name: ${projectData.appName}
- App Type: ${projectData.appType}
- Description: ${projectData.description}
- Desired Features: ${projectData.features}
- Target Audience: ${projectData.targetAudience}

Create a detailed, professional development plan that includes:

1. EXECUTIVE SUMMARY
   - Project overview and goals
   - Key value propositions

2. TECHNICAL ARCHITECTURE
   - Recommended technology stack
   - System architecture overview
   - Database design considerations

3. CORE FEATURES & PRIORITIES
   - Must-have features (Phase 1)
   - Nice-to-have features (Phase 2)
   - Future enhancements (Phase 3)

4. DEVELOPMENT TIMELINE
   - Estimated timeline for each phase
   - Key milestones

5. TECHNICAL CONSIDERATIONS
   - Security requirements
   - Scalability considerations
   - Performance optimization strategies

6. ESTIMATED RESOURCES
   - Development team composition
   - Approximate budget range
   - Third-party services needed

Keep it professional, actionable, and realistic. Use clear headings and bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    return response.text || "A comprehensive development plan has been generated for your project.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return `# Development Plan for ${projectData.appName}\n\nA comprehensive plan for building your ${projectData.appType} application. This project will serve ${projectData.targetAudience} with features including ${projectData.features}.\n\nDetailed technical specifications, timeline, and resource requirements will be provided by our development team.`;
  }
}
