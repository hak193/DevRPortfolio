import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Calendar, Target, Lightbulb, Users } from "lucide-react";
import { format } from "date-fns";
import type { AppProject } from "@shared/schema";

export default function ProjectDetails() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: project, isLoading, error } = useQuery<AppProject>({
    queryKey: ["/api/user/app-projects", id],
    enabled: !!user && !!id,
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loading-spinner" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Card>
              <CardContent className="py-24 text-center">
                <h2 className="text-2xl font-bold mb-2" data-testid="text-error-title">
                  Project Not Found
                </h2>
                <p className="text-muted-foreground mb-6" data-testid="text-error-message">
                  The project you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => navigate("/projects")} data-testid="button-back-to-projects">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/projects")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="text-app-name">
                  {project.appName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="text-created-date">
                    Created on {format(new Date(project.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-1" data-testid="badge-app-type">
                {project.appType}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed" data-testid="text-description">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed whitespace-pre-wrap" data-testid="text-features">
                  {project.features}
                </p>
              </CardContent>
            </Card>

            {/* Target Audience Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed" data-testid="text-target-audience">
                  {project.targetAudience}
                </p>
              </CardContent>
            </Card>

            {/* AI Plan Section */}
            {project.aiPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Development Plan</CardTitle>
                  <CardDescription>
                    A comprehensive plan generated by AI to help you build your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap" 
                    data-testid="text-ai-plan"
                  >
                    {project.aiPlan}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
