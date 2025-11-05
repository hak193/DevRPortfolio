import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, CheckCircle } from "lucide-react";
import type { Template } from "@shared/schema";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  isPurchased: boolean;
  onPurchase: (template: Template) => void;
  onDownload: (template: Template) => void;
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  isPurchased,
  onPurchase,
  onDownload,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  const handleImageSrc = (src: string) => {
    if (src.startsWith('@assets/')) {
      return `/api/placeholder/400/300`;
    }
    return src;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-testid="modal-template-preview"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2" data-testid="text-preview-title">
                {template.title}
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed" data-testid="text-preview-description">
                {template.description}
              </DialogDescription>
            </div>
            {isPurchased && (
              <Badge variant="default" className="bg-green-600 flex items-center gap-1" data-testid="badge-purchased">
                <CheckCircle className="h-3 w-3" />
                Purchased
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Preview Image */}
        <div className="aspect-video rounded-lg overflow-hidden border border-border mt-4">
          <img 
            src={handleImageSrc(template.image)} 
            alt={template.title}
            className="w-full h-full object-cover"
            data-testid="img-preview-template"
          />
        </div>

        {/* Features Section */}
        {template.features && template.features.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4" data-testid="text-features-heading">
              Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.features.map((feature, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-sm"
                  data-testid={`text-feature-${index}`}
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technology Stack */}
        {template.technologies && template.technologies.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4" data-testid="text-techstack-heading">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.technologies.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-sm"
                  data-testid={`badge-tech-${tech.toLowerCase()}`}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Price and Action Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" data-testid="text-preview-price">
              ${template.price}
            </span>
            <span className="text-sm text-muted-foreground">one-time payment</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {isPurchased ? (
              <Button 
                onClick={() => onDownload(template)}
                className="flex-1 sm:flex-initial"
                size="lg"
                data-testid="button-preview-download"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  onPurchase(template);
                  onClose();
                }}
                className="flex-1 sm:flex-initial"
                size="lg"
                data-testid="button-preview-purchase"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase Template
              </Button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            All templates include lifetime updates and premium support
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
