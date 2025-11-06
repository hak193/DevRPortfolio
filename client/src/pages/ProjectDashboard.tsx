import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FolderOpen, Plus, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { AppProject } from "@shared/schema";

export default function ProjectDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: projects = [], isLoading } = useQuery<AppProject[]>({
    queryKey: ["/api/user/app-projects"],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
              My Projects
            </h1>
            <p className="text-muted-foreground">
              View and manage your AI-generated app builder projects
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loading-spinner" />
            </div>
          ) : projects.length === 0 ? (
            <Card className="py-24">
              <CardContent className="text-center">
                <FolderOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground" data-testid="icon-empty-state" />
                <h2 className="text-2xl font-bold mb-2" data-testid="text-empty-title">
                  You haven't created any app projects yet
                </h2>
                <p className="text-muted-foreground mb-6" data-testid="text-empty-description">
                  Start building your dream application with our AI-powered app builder
                </p>
                <Button asChild size="default" data-testid="button-create-project">
                  <a href="/app-builder">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Project
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover-elevate" data-testid={`card-project-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl" data-testid={`text-app-name-${project.id}`}>
                        {project.appName}
                      </CardTitle>
                      <Badge variant="secondary" data-testid={`badge-app-type-${project.id}`}>
                        {project.appType}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3" data-testid={`text-description-${project.id}`}>
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span data-testid={`text-created-date-${project.id}`}>
                        {format(new Date(project.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                    {project.features && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Features:</p>
                        <p className="text-muted-foreground line-clamp-2" data-testid={`text-features-${project.id}`}>
                          {project.features}
                        </p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      data-testid={`button-view-details-${project.id}`}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
