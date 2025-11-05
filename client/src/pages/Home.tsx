import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/components/Footer';
import { Code2, Zap, Package } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  
  const services = [
    {
      icon: Code2,
      title: "Custom Development",
      description: "Full-stack web and mobile applications tailored to your business needs with modern technologies and best practices.",
      details: [
        "React & Node.js expertise",
        "Scalable cloud architecture",
        "Mobile-first responsive design",
        "Ongoing maintenance & support"
      ],
      ctaText: "Start Your Project"
    },
    {
      icon: Zap,
      title: "AI App Builder",
      description: "Smart prompting system that helps you define and build your application with AI assistance and automated code generation.",
      details: [
        "AI-powered requirement gathering",
        "Automated code generation",
        "Real-time collaboration",
        "Instant deployment options"
      ],
      ctaText: "Try App Builder"
    },
    {
      icon: Package,
      title: "Template Store",
      description: "Premium code templates, components, and full applications ready to customize and deploy to production.",
      details: [
        "React components & full apps",
        "Node.js API templates",
        "Production-ready code",
        "Lifetime updates included"
      ],
      ctaText: "Browse Templates"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-heading">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive software solutions designed to accelerate your digital transformation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  {...service}
                  onCtaClick={() => {
                    if (service.title === "Template Store") {
                      setLocation('/store');
                    } else if (service.title === "AI App Builder") {
                      setLocation('/app-builder');
                    } else if (service.title === "Custom Development") {
                      setLocation('/contact');
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-heading">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Let's discuss your project and create a solution that exceeds your expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block">
                <button className="min-h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2" data-testid="button-cta-contact">
                  Contact Us
                </button>
              </a>
              <a href="/store" className="inline-block">
                <button className="min-h-9 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover-elevate active-elevate-2" data-testid="button-cta-store">
                  Explore Templates
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
