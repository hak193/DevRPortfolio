import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, Package, Calendar, User, Mail, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

export default function Account() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: !!user,
  });

  const handleDownload = async (templateId: string, templateTitle: string) => {
    try {
      const response = await apiRequest("GET", `/api/downloads/${templateId}`);
      const data = await response.json();
      
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">My Account</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium" data-testid="text-username">{user.username}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium" data-testid="text-email">{user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    {user.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Email Status</p>
                      <p className="font-medium" data-testid="text-email-status">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium" data-testid="text-member-since">
                        {format(new Date(user.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Purchase History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>
                    All your purchased templates and download history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : purchases.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">No purchases yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Browse our store to find amazing templates
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => navigate("/store")}
                        data-testid="button-browse-store"
                      >
                        Browse Store
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase: any) => (
                        <div 
                          key={purchase.id} 
                          className="border rounded-lg p-4"
                          data-testid={`purchase-${purchase.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {purchase.template?.title || "Unknown Template"}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purchased on {format(new Date(purchase.purchasedAt), "MMMM d, yyyy")}
                              </p>
                              {purchase.template && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {purchase.template.technologies.slice(0, 3).map((tech: string) => (
                                    <Badge key={tech} variant="secondary">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 text-sm text-muted-foreground">
                                Downloads: {purchase.downloadCount}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-lg font-bold">
                                ${purchase.template?.price || 0}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(
                                  purchase.templateId,
                                  purchase.template?.title || "Template"
                                )}
                                data-testid={`button-download-${purchase.id}`}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}