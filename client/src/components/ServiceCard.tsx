import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  ctaText: string;
  onCtaClick: () => void;
}

export default function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  details, 
  ctaText, 
  onCtaClick 
}: ServiceCardProps) {
  return (
    <Card className="p-8 rounded-xl shadow-2xl hover:-translate-y-2 transition-transform duration-300" data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col h-full">
        <Icon className="h-12 w-12 text-primary mb-6" />
        
        <h3 className="text-2xl font-bold mb-4" data-testid={`text-service-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h3>
        
        <p className="text-base text-muted-foreground leading-relaxed mb-6" data-testid={`text-service-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </p>
        
        <div className="bg-muted rounded-lg p-4 mb-6 flex-grow">
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start" data-testid={`text-service-detail-${index}`}>
                <span className="text-primary mr-2">•</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          onClick={onCtaClick}
          className="w-full"
          data-testid={`button-service-cta-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {ctaText}
        </Button>
      </div>
    </Card>
  );
}
