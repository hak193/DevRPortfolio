import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Eye } from 'lucide-react';
import { ReactNode } from 'react';

interface TemplateCardProps {
  title: string;
  description: string;
  previewImage: string;
  techStack: string[];
  price: number | 'free';
  onView: () => void;
  onDownload: () => void;
  customAction?: ReactNode;
}

export default function TemplateCard({
  title,
  description,
  previewImage,
  techStack,
  price,
  onView,
  onDownload,
  customAction
}: TemplateCardProps) {
  // Handle image source - convert @assets path to proper import
  const getImageSrc = (src: string) => {
    if (src.startsWith('@assets/')) {
      // In production, these would be properly imported
      // For now, use a placeholder
      return `/api/placeholder/400/300`;
    }
    return src;
  };

  return (
    <Card className="overflow-hidden rounded-xl shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col" data-testid={`card-template-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative aspect-video overflow-hidden group">
        <img 
          src={getImageSrc(previewImage)} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="backdrop-blur-md bg-white bg-opacity-20 border-white border-opacity-30 text-white"
            data-testid={`button-template-preview-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2" data-testid={`text-template-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow" data-testid={`text-template-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs"
              data-testid={`badge-tech-${tech.toLowerCase()}`}
            >
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl font-bold" data-testid={`text-template-price-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {price === 'free' ? 'Free' : `$${price}`}
          </span>
          {customAction || (
            <Button onClick={onDownload} data-testid={`button-template-download-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              <Download className="mr-2 h-4 w-4" />
              {price === 'free' ? 'Download' : 'Purchase'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}