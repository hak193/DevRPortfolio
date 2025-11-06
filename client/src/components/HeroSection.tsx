import { ArrowRight, Code, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import heroImage from '@assets/generated_images/Worcester_MA_tech_workspace_hero_e0f14d46.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-6" data-testid="text-hero-title">
          Professional Software Development
          <br />
          <span className="text-primary">in Worcester, MA</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12" data-testid="text-hero-subtitle">
          Custom applications, AI-powered app builders, and premium code templates. 
          Building the future of software, one line at a time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="backdrop-blur-md bg-primary bg-opacity-90 hover:bg-opacity-100 min-w-[180px]"
            data-testid="button-view-services"
            asChild
          >
            <Link href="/services">
              <Code className="mr-2 h-5 w-5" />
              View Services
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 border-white border-opacity-30 text-white min-w-[180px]"
            data-testid="button-browse-templates"
            asChild
          >
            <Link href="/store">
              <ArrowRight className="mr-2 h-5 w-5" />
              Browse Templates
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 border-white border-opacity-30 text-white min-w-[180px]"
            data-testid="button-build-app"
            asChild
          >
            <Link href="/app-builder">
              <Zap className="mr-2 h-5 w-5" />
              Build Your App
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
