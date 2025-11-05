import { Code2, Zap, Package } from 'lucide-react';
import ServiceCard from '../ServiceCard';

export default function ServiceCardExample() {
  const services = [
    {
      icon: Code2,
      title: "Custom Development",
      description: "Full-stack web and mobile applications tailored to your business needs with modern technologies.",
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
      description: "Smart prompting system that helps you define and build your application with AI assistance.",
      details: [
        "AI-powered requirement gathering",
        "Automated code generation",
        "Real-time collaboration",
        "Instant deployment"
      ],
      ctaText: "Try App Builder"
    },
    {
      icon: Package,
      title: "Template Store",
      description: "Premium code templates, components, and full applications ready to customize and deploy.",
      details: [
        "React components & full apps",
        "Node.js API templates",
        "Production-ready code",
        "Lifetime updates"
      ],
      ctaText: "Browse Templates"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          {...service}
          onCtaClick={() => console.log(`${service.title} CTA clicked`)}
        />
      ))}
    </div>
  );
}
