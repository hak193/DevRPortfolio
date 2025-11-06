import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { insertTemplateSchema, type Template, type InsertTemplate } from "@shared/schema";
import { z } from "zod";

const formSchema = insertTemplateSchema.extend({
  technologies: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
  features: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
});

type FormValues = Omit<z.infer<typeof formSchema>, 'technologies' | 'features'> & {
  technologies: string;
  features: string;
};

export default function AdminTemplates() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    enabled: !!user?.isAdmin,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema.omit({ technologies: true, features: true }).extend({
      technologies: z.string().min(1, "Technologies are required"),
      features: z.string().min(1, "Features are required"),
    })),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      image: "",
      downloadUrl: "",
      technologies: "",
      features: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTemplate) => {
      const response = await apiRequest("POST", "/api/admin/templates", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create template");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create template", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTemplate> }) => {
      const response = await apiRequest("PATCH", `/api/admin/templates/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update template");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template updated successfully" });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update template", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/templates/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete template");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete template", description: error.message, variant: "destructive" });
    },
  });

  const updateImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/templates/update-images");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update images");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ 
        title: "Images updated successfully", 
        description: `Updated ${data.count} template images with stock photos` 
      });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update images", description: error.message, variant: "destructive" });
    },
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    form.reset({
      title: "",
      description: "",
      category: "",
      price: 0,
      image: "",
      downloadUrl: "",
      technologies: "",
      features: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.reset({
      title: template.title,
      description: template.description,
      category: template.category,
      price: template.price,
      image: template.image,
      downloadUrl: template.downloadUrl,
      technologies: template.technologies.join(', '),
      features: template.features.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: FormValues) => {
    const data: InsertTemplate = {
      ...values,
      technologies: values.technologies.split(',').map(s => s.trim()).filter(Boolean),
      features: values.features.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold" data-testid="text-page-title">Manage Templates</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => updateImagesMutation.mutate()}
                disabled={updateImagesMutation.isPending}
                data-testid="button-update-images"
              >
                {updateImagesMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Update Stock Photos
              </Button>
              <Button onClick={handleCreate} data-testid="button-create-template">
                <Plus className="mr-2 h-4 w-4" />
                Create New Template
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Manage all templates in the store</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : templates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No templates yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Technologies</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell data-testid={`template-title-${template.id}`}>
                          {template.title}
                        </TableCell>
                        <TableCell data-testid={`template-category-${template.id}`}>
                          {template.category}
                        </TableCell>
                        <TableCell data-testid={`template-price-${template.id}`}>
                          ${(template.price / 100).toFixed(2)}
                        </TableCell>
                        <TableCell data-testid={`template-tech-${template.id}`}>
                          {template.technologies.slice(0, 3).join(', ')}
                          {template.technologies.length > 3 && '...'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(template)}
                              data-testid={`button-edit-${template.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(template.id)}
                              data-testid={`button-delete-${template.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle data-testid="dialog-title">
                  {editingTemplate ? "Edit Template" : "Create New Template"}
                </DialogTitle>
                <DialogDescription>
                  {editingTemplate ? "Update template information" : "Add a new template to the store"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} data-testid="input-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-category" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="downloadUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Download URL</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-download-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="React, Node.js, PostgreSQL" data-testid="input-technologies" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Authentication, Dashboard, Analytics"
                            data-testid="input-features"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingTemplate ? (
                        "Update Template"
                      ) : (
                        "Create Template"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
