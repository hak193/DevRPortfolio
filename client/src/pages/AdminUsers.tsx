import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle, XCircle, Shield, ShieldOff } from "lucide-react";
import { format } from "date-fns";
import type { SafeUser } from "@shared/schema";

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [confirmUser, setConfirmUser] = useState<{ id: string; username: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const { data: users = [], isLoading } = useQuery<SafeUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const updateAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/admin`, { isAdmin });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User admin status updated successfully" });
      setConfirmUser(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
      setConfirmUser(null);
    },
  });

  const handleToggleAdmin = (targetUser: SafeUser) => {
    if (targetUser.id === user?.id) {
      toast({
        title: "Cannot modify yourself",
        description: "You cannot change your own admin status",
        variant: "destructive",
      });
      return;
    }

    setConfirmUser({
      id: targetUser.id,
      username: targetUser.username,
      isAdmin: !targetUser.isAdmin,
    });
  };

  const confirmToggleAdmin = () => {
    if (confirmUser) {
      updateAdminMutation.mutate({
        userId: confirmUser.id,
        isAdmin: confirmUser.isAdmin,
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
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
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">Manage Users</h1>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage user accounts and admin privileges</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Email Verified</TableHead>
                      <TableHead>Admin Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} data-testid={`user-row-${u.id}`}>
                        <TableCell data-testid={`user-username-${u.id}`}>
                          {u.username}
                          {u.id === user.id && (
                            <Badge variant="secondary" className="ml-2">You</Badge>
                          )}
                        </TableCell>
                        <TableCell data-testid={`user-email-${u.id}`}>
                          {u.email}
                        </TableCell>
                        <TableCell data-testid={`user-verified-${u.id}`}>
                          {u.emailVerified ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span>Unverified</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell data-testid={`user-admin-${u.id}`}>
                          {u.isAdmin ? (
                            <Badge variant="default">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <ShieldOff className="h-3 w-3 mr-1" />
                              User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell data-testid={`user-created-${u.id}`}>
                          {format(new Date(u.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={u.isAdmin ? "destructive" : "default"}
                            onClick={() => handleToggleAdmin(u)}
                            disabled={u.id === user.id || updateAdminMutation.isPending}
                            data-testid={`button-toggle-admin-${u.id}`}
                          >
                            {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <AlertDialog open={!!confirmUser} onOpenChange={() => setConfirmUser(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle data-testid="dialog-title">Confirm Admin Status Change</AlertDialogTitle>
                <AlertDialogDescription data-testid="dialog-description">
                  Are you sure you want to {confirmUser?.isAdmin ? "grant" : "revoke"} admin privileges{" "}
                  {confirmUser?.isAdmin ? "to" : "from"} <strong>{confirmUser?.username}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmToggleAdmin} data-testid="button-confirm">
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
