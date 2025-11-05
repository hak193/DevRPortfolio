import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import TemplateCard from '@/components/TemplateCard';
import CheckoutModal from '@/components/CheckoutModal';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ShoppingCart, Download, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Template } from '@shared/schema';

export default function Store() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery<any[]>({
    queryKey: ['/api/user/purchases'],
    enabled: !!user,
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const purchasedTemplateIds = useMemo(() => {
    return new Set(purchases.map(p => p.templateId));
  }, [purchases]);

  const handlePurchase = (template: Template) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase templates",
        variant: "default",
      });
      navigate("/login");
      return;
    }

    if (!user.emailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email before making purchases",
        variant: "default",
      });
      navigate("/verify-email");
      return;
    }

    setSelectedTemplate(template);
    setIsCheckoutOpen(true);
  };

  const handleDownload = async (template: Template) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to download templates",
        variant: "default",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await apiRequest("GET", `/api/downloads/${template.id}`);
      const data = await response.json();
      
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
        toast({
          title: "Download Started",
          description: `Downloading ${template.title}...`,
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the template",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/user/purchases'] });
    toast({
      title: "Purchase Successful!",
      description: "You can now download your template from your account page.",
    });
  };

  const isLoading = templatesLoading || purchasesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6" data-testid="text-page-title">
              Premium Code Templates
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Production-ready templates to accelerate your development. All templates include lifetime updates.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-border h-12"
                data-testid="input-search-templates"
              />
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm hover-elevate active-elevate-2"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase()}`}
                >
                  {category === 'all' ? 'All Templates' : category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No templates found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => {
                  const isPurchased = purchasedTemplateIds.has(template.id);
                  
                  return (
                    <div key={template.id} className="relative">
                      {isPurchased && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge variant="default" className="bg-green-600">
                            Purchased
                          </Badge>
                        </div>
                      )}
                      <TemplateCard
                        title={template.title}
                        description={template.description}
                        previewImage={template.image}
                        techStack={template.technologies}
                        price={template.price}
                        onView={() => setPreviewTemplate(template)}
                        onDownload={() => {
                          if (isPurchased) {
                            handleDownload(template);
                          } else {
                            handlePurchase(template);
                          }
                        }}
                        customAction={
                          isPurchased ? (
                            <Button 
                              className="w-full"
                              onClick={() => handleDownload(template)}
                              data-testid={`button-download-${template.id}`}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          ) : (
                            <Button 
                              className="w-full"
                              onClick={() => handlePurchase(template)}
                              data-testid={`button-purchase-${template.id}`}
                            >
                              {user ? (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Purchase - ${template.price}
                                </>
                              ) : (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Login to Purchase
                                </>
                              )}
                            </Button>
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onSuccess={handlePurchaseSuccess}
      />
      
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        isPurchased={previewTemplate ? purchasedTemplateIds.has(previewTemplate.id) : false}
        onPurchase={handlePurchase}
        onDownload={handleDownload}
      />
      
      <Footer />
    </div>
  );
}